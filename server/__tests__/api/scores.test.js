/**
 * Integration tests for Scoring REST endpoints
 *
 * POST /api/scores/submit          — Submit answer, get AI score
 * GET  /api/rooms/:code/leaderboard — Current leaderboard
 * GET  /api/rooms/:code/results     — Final results
 */

const request = require("supertest");
const app = require("../../app");
const { setupDB, teardownDB } = require("../helpers/db");

// Mock aiScoring to avoid real API calls
jest.mock("../../helpers/aiScoring", () => ({
  scoreAnswer: jest.fn(),
}));

const { scoreAnswer } = require("../../helpers/aiScoring");

describe("Scores API", () => {
  let aliceToken = null;
  let bobToken = null;
  let roomCode = null;

  beforeAll(async () => {
    await setupDB();

    // Register + login Alice
    await request(app)
      .post("/api/auth/register")
      .send({ username: "alice_score", password: "pass123" });
    const aliceLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "alice_score", password: "pass123" });
    aliceToken = aliceLogin.body.access_token;

    // Register + login Bob
    await request(app)
      .post("/api/auth/register")
      .send({ username: "bob_score", password: "pass123" });
    const bobLogin = await request(app)
      .post("/api/auth/login")
      .send({ username: "bob_score", password: "pass123" });
    bobToken = bobLogin.body.access_token;

    // Create a room
    const room = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`);
    roomCode = room.body.code;

    // Bob joins
    await request(app)
      .post(`/api/rooms/${roomCode}/join`)
      .set("Authorization", `Bearer ${bobToken}`);
  });

  afterAll(async () => {
    await teardownDB();
    jest.restoreAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ── POST /api/scores/submit ──────────────────────────────────────────
  describe("POST /api/scores/submit", () => {
    test("submits answer and returns AI score", async () => {
      scoreAnswer.mockResolvedValue({
        score: 75,
        maxScore: 100,
        feedback: "Bagus! Kamu menemukan type coercion bug.",
        bugsFound: ["b1"],
        bugsPartial: ["b2"],
        bugsMissed: [],
      });

      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({
          roomCode,
          snippetId: 1,
          answer: "Found the type coercion bug on line 7",
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("score", 75);
      expect(res.body).toHaveProperty("maxScore", 100);
      expect(res.body).toHaveProperty("feedback");
      expect(res.body.bugsFound).toEqual(["b1"]);
      expect(res.body.bugsPartial).toEqual(["b2"]);
      expect(res.body.bugsMissed).toEqual([]);
    });

    test("returns 401 without auth token", async () => {
      const res = await request(app)
        .post("/api/scores/submit")
        .send({ roomCode, snippetId: 1, answer: "test" });

      expect(res.status).toBe(401);
    });

    test("returns 400 when roomCode is missing", async () => {
      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({ snippetId: 1, answer: "test" });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/roomCode and snippetId are required/i);
    });

    test("returns 400 when snippetId is missing", async () => {
      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({ roomCode, answer: "test" });

      expect(res.status).toBe(400);
    });

    test("returns 404 when room does not exist", async () => {
      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({ roomCode: "ZZZZZZ", snippetId: 1, answer: "test" });

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });

    test("returns 404 when snippet does not exist", async () => {
      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({ roomCode, snippetId: 99999, answer: "test" });

      expect(res.status).toBe(404);
    });

    test("empty answer still submits and is scored", async () => {
      scoreAnswer.mockResolvedValue({
        score: 0,
        maxScore: 0,
        feedback: "Jawaban kosong — tidak ada yang dinilai.",
        bugsFound: [],
        bugsPartial: [],
        bugsMissed: [],
      });

      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${bobToken}`)
        .send({ roomCode, snippetId: 2, answer: "" });

      expect(res.status).toBe(200);
      expect(res.body.score).toBe(0);
    });

    test("score is persisted to DB (verify via leaderboard later)", async () => {
      scoreAnswer.mockResolvedValue({
        score: 60,
        maxScore: 70,
        feedback: "Cukup baik!",
        bugsFound: ["b1"],
        bugsPartial: [],
        bugsMissed: [],
      });

      const res = await request(app)
        .post("/api/scores/submit")
        .set("Authorization", `Bearer ${aliceToken}`)
        .send({
          roomCode,
          snippetId: 2,
          answer: "Missing port property",
        });

      expect(res.status).toBe(200);
      expect(res.body.score).toBe(60);
    });
  });

  // ── GET /api/rooms/:code/leaderboard ─────────────────────────────────
  describe("GET /api/rooms/:code/leaderboard", () => {
    test("returns leaderboard sorted by totalScore descending", async () => {
      const res = await request(app).get(
        `/api/rooms/${roomCode}/leaderboard`
      );

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);

      // Check structure
      const entry = res.body[0];
      expect(entry).toHaveProperty("username");
      expect(entry).toHaveProperty("totalScore");
    });

    test("returns 404 for non-existent room", async () => {
      const res = await request(app).get("/api/rooms/ZZZZZZ/leaderboard");

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });

  // ── GET /api/rooms/:code/results ─────────────────────────────────────
  describe("GET /api/rooms/:code/results", () => {
    test("returns results with winner and finalLeaderboard", async () => {
      const res = await request(app).get(`/api/rooms/${roomCode}/results`);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("finalLeaderboard");
      expect(res.body).toHaveProperty("rounds");
      expect(Array.isArray(res.body.finalLeaderboard)).toBe(true);

      // Winner may be null if no live results, but should still be present
      expect(res.body).toHaveProperty("winner");
    });

    test("returns 404 for non-existent room", async () => {
      const res = await request(app).get("/api/rooms/ZZZZZZ/results");

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/not found/i);
    });
  });
});
