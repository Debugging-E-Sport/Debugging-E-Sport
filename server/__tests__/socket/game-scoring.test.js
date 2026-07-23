/**
 * Socket.IO game scoring flow tests
 *
 * Tests:
 *  - game:submit with answer → scoring + game:score emission
 *  - game:submit without auth → error
 *  - game:submit double submission → prevented
 *  - game:ready → round advance when all ready
 *  - game:all-submitted + game:leaderboard emitted when all submit
 */

const { io: Client } = require("socket.io-client");
const app = require("../../app");
const { setupDB, teardownDB } = require("../helpers/db");
const request = require("supertest");
const { signToken } = require("../../helpers/jwt");

// Mock aiScoring to avoid real API calls
jest.mock("../../helpers/aiScoring", () => ({
  scoreAnswer: jest.fn(),
}));

const { scoreAnswer } = require("../../helpers/aiScoring");
const { gameRooms } = require("../../socket/gameHandler");

const httpServer = app.server;
let httpServerAddr = null;

// Create JWT tokens for test users
function makeToken(id, username) {
  return signToken({ id, username });
}

beforeAll(async () => {
  await setupDB();

  // Register users via REST
  await request(app)
    .post("/api/auth/register")
    .send({ username: "sock_alice", password: "pass123" });
  await request(app)
    .post("/api/auth/register")
    .send({ username: "sock_bob", password: "pass123" });

  // Get user IDs by logging in (jwt payload carries id)
  const aliceLogin = await request(app)
    .post("/api/auth/login")
    .send({ username: "sock_alice", password: "pass123" });

  // Start HTTP server on a random port for Socket.IO
  await new Promise((resolve) => {
    httpServer.listen(() => {
      const { port } = httpServer.address();
      httpServerAddr = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  // Clean up any game rooms left over
  for (const [code] of gameRooms) {
    gameRooms.delete(code);
  }

  // Close HTTP server with a timeout
  await new Promise((resolve) => {
    const t = setTimeout(() => {
      resolve();
    }, 2000);
    httpServer.close(() => {
      clearTimeout(t);
      resolve();
    });
  });

  await teardownDB();
  jest.restoreAllMocks();
}, 20000);

beforeEach(() => {
  jest.clearAllMocks();
  // Clean up game rooms between tests
  for (const [code] of gameRooms) {
    gameRooms.delete(code);
  }
});

describe("Socket.IO — Game Scoring Flow", () => {
  // Helper: create a connected socket with auth
  function connectSocket(token) {
    return new Promise((resolve, reject) => {
      const socket = Client(`${httpServerAddr}/game`, {
        transports: ["websocket"],
        timeout: 8000,
        auth: { token },
      });

      socket.on("connect", () => resolve(socket));
      socket.on("connect_error", (err) => reject(err));

      setTimeout(() => reject(new Error("Connection timeout")), 8000);
    });
  }

  // Helper: create room + join both players via socket
  async function setupRoom(aliceToken, bobToken) {
    // Create room via REST
    const room = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`);

    const roomCode = room.body.code;

    // Bob joins via REST
    await request(app)
      .post(`/api/rooms/${roomCode}/join`)
      .set("Authorization", `Bearer ${bobToken}`);

    return roomCode;
  }

  // ── game:submit ──────────────────────────────────────────────────────
  test("game:submit with answer emits game:score to the submitter", async () => {
    // Set up users
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const bobToken = bobLogin.body.access_token;

    const roomCode = await setupRoom(aliceToken, bobToken);

    // Mock scoreAnswer
    scoreAnswer.mockResolvedValue({
      score: 75,
      maxScore: 100,
      feedback: "Good job!",
      bugsFound: ["b1"],
      bugsPartial: ["b2"],
      bugsMissed: [],
    });

    const aliceSocket = await connectSocket(aliceToken);

    // Join the room via socket
    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      // Wait a tick for join to register
      setTimeout(resolve, 300);
    });

    // Submit an answer
    const scorePromise = new Promise((resolve, reject) => {
      aliceSocket.on("game:score", (data) => {
        try {
          expect(data).toHaveProperty("score", 75);
          expect(data).toHaveProperty("maxScore", 100);
          expect(data).toHaveProperty("feedback");
          expect(data.bugsFound).toEqual(["b1"]);
          resolve();
        } catch (e) {
          reject(e);
        }
      });

      setTimeout(() => reject(new Error("game:score not received")), 5000);

      aliceSocket.emit("game:submit", {
        roomCode,
        snippetId: 1,
        answer: "Found the type coercion bug",
      });
    });

    await scorePromise;
    aliceSocket.disconnect();
  }, 15000);

  test("game:submit without roomCode emits game:error", async () => {
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const aliceSocket = await connectSocket(aliceToken);

    // Join a room first
    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const roomCode = await setupRoom(aliceToken, bobLogin.body.access_token);

    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      setTimeout(resolve, 300);
    });

    const errorPromise = new Promise((resolve, reject) => {
      aliceSocket.on("game:error", (data) => {
        expect(data.message).toMatch(/roomCode/);
        resolve();
      });
      setTimeout(() => reject(new Error("game:error not received")), 3000);
      aliceSocket.emit("game:submit", { snippetId: 1, answer: "test" });
    });

    await errorPromise;
    aliceSocket.disconnect();
  }, 15000);

  test("game:submit double submission is prevented", async () => {
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const roomCode = await setupRoom(aliceToken, bobLogin.body.access_token);

    scoreAnswer.mockResolvedValue({
      score: 50,
      maxScore: 100,
      feedback: "Ok",
      bugsFound: [],
      bugsPartial: [],
      bugsMissed: ["b1"],
    });

    const aliceSocket = await connectSocket(aliceToken);

    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      setTimeout(resolve, 300);
    });

    // First submission — should score
    const firstScore = new Promise((resolve) => {
      aliceSocket.once("game:score", () => resolve());
      aliceSocket.emit("game:submit", {
        roomCode,
        snippetId: 1,
        answer: "First answer",
      });
    });

    await firstScore;

    // Second submission — should be rejected
    const secondError = new Promise((resolve, reject) => {
      aliceSocket.on("game:error", (data) => {
        try {
          expect(data.message).toMatch(/Already submitted/i);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      setTimeout(() => reject(new Error("game:error not received for double submit")), 3000);
      aliceSocket.emit("game:submit", {
        roomCode,
        snippetId: 1,
        answer: "Second answer",
      });
    });

    await secondError;
    aliceSocket.disconnect();
  }, 15000);

  test("sockets without auth token receive error", async () => {
    const socket = Client(`${httpServerAddr}/game`, {
      transports: ["websocket"],
      timeout: 5000,
    });

    await new Promise((resolve, reject) => {
      socket.on("connect_error", (err) => {
        expect(err.message).toMatch(/Authentication/i);
        resolve();
      });
      socket.on("connect", () => {
        reject(new Error("Should not connect without token"));
      });
      setTimeout(() => reject(new Error("Timeout waiting for auth error")), 5000);
    });

    socket.disconnect();
  }, 10000);

  // ── game:ready ──────────────────────────────────────────────────────
  test("game:ready triggers round advancement when all players ready", async () => {
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const bobToken = bobLogin.body.access_token;

    const roomCode = await setupRoom(aliceToken, bobToken);

    // Both players connect
    const aliceSocket = await connectSocket(aliceToken);
    const bobSocket = await connectSocket(bobToken);

    // Both join
    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      bobSocket.emit("game:join", { roomCode });
      setTimeout(resolve, 300);
    });

    // Clear any existing state and set up a round manually
    // — since game hasn't started, there are no rounds yet.
    // We'll just test the round-ready counter mechanic via socket.

    // Manually simulate: set up game state so currentRound=1 and submissions are done
    const roomState = gameRooms.get(roomCode);
    if (roomState) {
      // Simulate end of round 1 — all submissions done
      for (const [sid] of roomState.players) {
        roomState.submissions.add(sid);
      }
    }

    // Both emit ready — should advance to round 2
    const roundStartPromise = new Promise((resolve, reject) => {
      aliceSocket.on("game:round-start", (data) => {
        try {
          expect(data).toHaveProperty("round");
          expect(data).toHaveProperty("snippet");
          expect(data).toHaveProperty("timeLimit");
          resolve();
        } catch (e) {
          reject(e);
        }
      });

      setTimeout(() => reject(new Error("game:round-start not received")), 8000);

      // Both signal ready simultaneously
      aliceSocket.emit("game:ready", { roomCode });
      bobSocket.emit("game:ready", { roomCode });
    });

    await roundStartPromise;

    aliceSocket.disconnect();
    bobSocket.disconnect();
  }, 15000);

  // ── game:all-submitted ──────────────────────────────────────────────
  test("all-submitted is emitted when every player submits", async () => {
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const bobToken = bobLogin.body.access_token;

    const roomCode = await setupRoom(aliceToken, bobToken);

    scoreAnswer.mockResolvedValue({
      score: 50,
      maxScore: 100,
      feedback: "Good",
      bugsFound: [],
      bugsPartial: [],
      bugsMissed: [],
    });

    const aliceSocket = await connectSocket(aliceToken);
    const bobSocket = await connectSocket(bobToken);

    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      bobSocket.emit("game:join", { roomCode });
      setTimeout(resolve, 300);
    });

    // Wait for both scores
    const scoresReceived = [];
    const scoreCollector = (data) => scoresReceived.push(data);
    aliceSocket.on("game:score", scoreCollector);
    bobSocket.on("game:score", scoreCollector);

    // Watch for all-submitted on bob too (broadcast)
    const allSubmittedPromise = new Promise((resolve, reject) => {
      bobSocket.on("game:all-submitted", (data) => {
        expect(data).toHaveProperty("round");
        resolve();
      });
      setTimeout(() => reject(new Error("game:all-submitted not received")), 8000);
    });

    // Submit from both
    aliceSocket.emit("game:submit", {
      roomCode,
      snippetId: 1,
      answer: "Alice's answer",
    });

    bobSocket.emit("game:submit", {
      roomCode,
      snippetId: 1,
      answer: "Bob's answer",
    });

    await allSubmittedPromise;

    aliceSocket.disconnect();
    bobSocket.disconnect();
  }, 15000);

  // ── game:leave cleans up state ──────────────────────────────────────
  test("game:leave removes player from room state", async () => {
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_alice", password: "pass123" });
    const aliceToken = aliceLogin.body.access_token;

    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "sock_bob", password: "pass123" });
    const bobToken = bobLogin.body.access_token;

    const roomCode = await setupRoom(aliceToken, bobToken);

    const aliceSocket = await connectSocket(aliceToken);
    const bobSocket = await connectSocket(bobToken);

    // Both join
    await new Promise((resolve) => {
      aliceSocket.emit("game:join", { roomCode });
      bobSocket.emit("game:join", { roomCode });
      setTimeout(resolve, 300);
    });

    // Verify players are in game room
    const roomState = gameRooms.get(roomCode);
    expect(roomState).toBeDefined();
    expect(roomState.players.size).toBeGreaterThanOrEqual(2);

    // Bob listens for player-left (broadcast to room, leaver won't receive it)
    const playerLeftPromise = new Promise((resolve, reject) => {
      bobSocket.on("game:player-left", (data) => {
        try {
          expect(data).toHaveProperty("username");
          expect(typeof data.playerCount).toBe("number");
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      setTimeout(() => reject(new Error("game:player-left not received")), 3000);

      aliceSocket.emit("game:leave", { roomCode });
    });

    await playerLeftPromise;

    // Alice should be removed
    expect(roomState.players.has(aliceSocket.id)).toBe(false);

    aliceSocket.disconnect();
    bobSocket.disconnect();
  }, 15000);
});
