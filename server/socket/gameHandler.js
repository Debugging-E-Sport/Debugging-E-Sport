/**
 * Socket.IO Game Handler — per-room game state, round lifecycle, scoring.
 *
 * Room game state is kept in-memory (Map keyed by roomCode).
 * Each room tracks:
 *   - players: Map<socketId, { username, userId, totalScore, ready }>
 *   - currentRound, totalRounds, roundDuration
 *   - currentSnippetId, submissions: Set<socketId>
 *   - timer: NodeJS.Timeout | null
 */

const { scoreAnswer } = require("../helpers/aiScoring");
const { Snippet, Score, Room, User, RoomParticipants } = require("../models/index");

/** @type {Map<string, any>} roomCode → game state */
const gameRooms = new Map();

const DEFAULT_TOTAL_ROUNDS = 5;
const DEFAULT_ROUND_DURATION_SEC = 60;

// ── helpers ──────────────────────────────────────────────────────────────────

function getOrCreateRoomState(roomCode, overrides = {}) {
  if (!gameRooms.has(roomCode)) {
    gameRooms.set(roomCode, {
      code: roomCode,
      players: new Map(),     // socketId → { username, userId, totalScore, ready }
      currentRound: 0,
      totalRounds: overrides.totalRounds || DEFAULT_TOTAL_ROUNDS,
      roundDuration: overrides.roundDuration || DEFAULT_ROUND_DURATION_SEC,
      currentSnippetId: null,
      submissions: new Set(), // socketIds that have submitted this round
      roundReady: new Set(),  // socketIds that signaled ready
      timer: null,
    });
  }
  return gameRooms.get(roomCode);
}

function clearRoomTimer(room) {
  if (room.timer) {
    clearTimeout(room.timer);
    room.timer = null;
  }
}

/**
 * Build leaderboard array from room state.
 * Returns [{ username, totalScore }] sorted descending.
 */
function buildLeaderboard(roomState) {
  const entries = [];
  for (const [, player] of roomState.players) {
    entries.push({ username: player.username, totalScore: player.totalScore });
  }
  entries.sort((a, b) => b.totalScore - a.totalScore);
  return entries;
}

// ── socket authentication helper (reuse JWT verify) ──────────────────────────

const { verifyToken } = require("../helpers/jwt");
const { User: UserModel } = require("../models/index");

/**
 * Authenticate a socket connection using the JWT token passed in handshake auth.
 * Attaches `socket.user` with { id, username } on success.
 */
async function authenticateSocket(socket) {
  const token = socket.handshake.auth?.token;
  if (!token) {
    socket.emit("game:error", { message: "Authentication required" });
    socket.disconnect(true);
    return false;
  }
  try {
    const payload = verifyToken(token);
    const user = await UserModel.findByPk(payload.id);
    if (!user) {
      socket.emit("game:error", { message: "User not found" });
      socket.disconnect(true);
      return false;
    }
    socket.user = { id: user.id, username: user.username };
    return true;
  } catch {
    socket.emit("game:error", { message: "Invalid or expired token" });
    socket.disconnect(true);
    return false;
  }
}

// ── main setup ──────────────────────────────────────────────────────────────

/**
 * Attach game namespace event handlers to the /game Socket.IO namespace.
 * @param {import("socket.io").Namespace} game - the /game namespace
 */
function setupGameHandlers(game) {
  // Auth middleware for socket connections
  game.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const payload = verifyToken(token);
      const user = await UserModel.findByPk(payload.id);
      if (!user) return next(new Error("User not found"));
      socket.user = { id: user.id, username: user.username };
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  game.on("connection", (socket) => {
    console.log(`⚡ Game socket connected: ${socket.id} (${socket.user?.username})`);

    // ── game:join ──────────────────────────────────────────────────────
    socket.on("game:join", async (data) => {
      try {
        const { roomCode } = data;
        if (!roomCode) {
          socket.emit("game:error", { message: "roomCode is required" });
          return;
        }

        const room = await Room.findOne({ where: { code: roomCode } });
        if (!room) {
          socket.emit("game:error", { message: "Room not found" });
          return;
        }

        // Ensure user is in the room
        await RoomParticipants.findOrCreate({
          where: { roomId: room.id, userId: socket.user.id },
          defaults: { roomId: room.id, userId: socket.user.id },
        });

        socket.join(roomCode);

        const roomState = getOrCreateRoomState(roomCode);
        roomState.players.set(socket.id, {
          userId: socket.user.id,
          username: socket.user.username,
          totalScore: 0,
          ready: false,
        });

        // Attach room code to socket for cleanup
        socket._roomCode = roomCode;

        console.log(`${socket.user.username} joined room ${roomCode}`);

        // Build players list for the emit
        const playersList = [];
        for (const [, player] of roomState.players) {
          playersList.push({ id: player.userId, username: player.username });
        }

        game.to(roomCode).emit("game:player-joined", {
          username: socket.user.username,
          playerCount: roomState.players.size,
          players: playersList,
        });

        // If game is already in progress, catch this socket up
        if (room.status === "playing") {
          socket.emit("game:started", {
            totalRounds: roomState.totalRounds,
            roundDuration: roomState.roundDuration,
          });

          // If there's an active round, send current state immediately
          if (roomState.currentSnippetId && roomState.currentRound > 0) {
            const { sequelize } = require("../models/index");
            const currentSnippet = await Snippet.findByPk(
              roomState.currentSnippetId,
              { attributes: ["id", "title", "context", "code"] }
            );

            if (currentSnippet) {
              socket.emit("game:round-start", {
                round: roomState.currentRound,
                snippet: {
                  id: currentSnippet.id,
                  title: currentSnippet.title,
                  context: currentSnippet.context,
                  code: currentSnippet.code,
                },
                timeLimit: roomState.roundDuration,
              });
            }
          }
        }
      } catch (err) {
        console.error("game:join error:", err);
      }
    });

    // ── game:leave ─────────────────────────────────────────────────────
    socket.on("game:leave", async (data) => {
      try {
        const roomCode = data?.roomCode || socket._roomCode;
        if (!roomCode) return;

        socket.leave(roomCode);
        const roomState = gameRooms.get(roomCode);
        if (roomState) {
          roomState.players.delete(socket.id);
          roomState.submissions.delete(socket.id);
          roomState.roundReady.delete(socket.id);
        }

        const playerCount = roomState ? roomState.players.size : 0;

        game.to(roomCode).emit("game:player-left", {
          username: socket.user.username,
          playerCount,
        });

        console.log(`${socket.user.username} left room ${roomCode}`);

        // Clean up empty room after a grace period
        if (playerCount === 0) {
          clearRoomTimer(roomState);
          gameRooms.delete(roomCode);
        }
      } catch (err) {
        console.error("game:leave error:", err);
      }
    });

    // ── game:submit ────────────────────────────────────────────────────
    socket.on("game:submit", async (data) => {
      try {
        const { roomCode, snippetId, answer } = data;
        if (!roomCode || !snippetId) {
          socket.emit("game:error", { message: "roomCode and snippetId are required" });
          return;
        }

        const roomState = gameRooms.get(roomCode);
        if (!roomState) {
          socket.emit("game:error", { message: "Game not started or room not found" });
          return;
        }

        // Prevent double submission
        if (roomState.submissions.has(socket.id)) {
          socket.emit("game:error", { message: "Already submitted for this round" });
          return;
        }

        roomState.submissions.add(socket.id);

        // Score the answer via AI
        const result = await scoreAnswer({ snippetId, answer });

        // Find room DB id for score persistence
        const room = await Room.findOne({ where: { code: roomCode } });
        if (room) {
          await Score.create({
            roomId: room.id,
            userId: socket.user.id,
            snippetId,
            round: roomState.currentRound,
            score: result.score,
            answer: answer || "",
            feedback: result.feedback,
          });
        }

        // Update player's total score
        const player = roomState.players.get(socket.id);
        if (player) {
          player.totalScore += result.score;
        }

        // Emit score ONLY to the submitter
        socket.emit("game:score", {
          username: socket.user.username,
          score: result.score,
          maxScore: result.maxScore,
          feedback: result.feedback,
          bugsFound: result.bugsFound,
          bugsPartial: result.bugsPartial,
          bugsMissed: result.bugsMissed,
        });

        console.log(
          `${socket.user.username} scored ${result.score}/${result.maxScore} in room ${roomCode} round ${roomState.currentRound}`
        );

        // Check if all players have submitted
        const totalPlayers = roomState.players.size;
        const submittedCount = roomState.submissions.size;

        if (submittedCount >= totalPlayers && totalPlayers > 0) {
          // Clear timer if still running
          clearRoomTimer(roomState);

          // Broadcast all-submitted
          game.to(roomCode).emit("game:all-submitted", {
            round: roomState.currentRound,
          });

          // Broadcast leaderboard
          const leaderboard = buildLeaderboard(roomState);
          game.to(roomCode).emit("game:leaderboard", leaderboard);

          // End round
          game.to(roomCode).emit("game:round-end", {
            round: roomState.currentRound,
          });

          // Auto-advance after 3s (client may not send game:ready)
          setTimeout(() => advanceToNextRound(game, roomCode, roomState), 3000);
        }
      } catch (err) {
        console.error("game:submit error:", err);
        socket.emit("game:error", { message: "Scoring failed — please try again" });
      }
    });

    // ── game:ready ─────────────────────────────────────────────────────
    socket.on("game:ready", async (data) => {
      try {
        const roomCode = data?.roomCode || socket._roomCode;
        if (!roomCode) return;

        const roomState = gameRooms.get(roomCode);
        if (!roomState) return;

        roomState.roundReady.add(socket.id);

        const totalPlayers = roomState.players.size;
        const readyCount = roomState.roundReady.size;

        console.log(
          `${socket.user.username} ready for next round (${readyCount}/${totalPlayers}) in ${roomCode}`
        );

        // When all players are ready, advance to next round
        if (readyCount >= totalPlayers && totalPlayers > 0) {
          await advanceToNextRound(game, roomCode, roomState);
        }
      } catch (err) {
        console.error("game:ready error:", err);
      }
    });

    // ── disconnect ─────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`🔌 Game socket disconnected: ${socket.id} (${socket.user?.username})`);
      const roomCode = socket._roomCode;
      if (!roomCode) return;

      const roomState = gameRooms.get(roomCode);
      if (!roomState) return;

      roomState.players.delete(socket.id);
      roomState.submissions.delete(socket.id);
      roomState.roundReady.delete(socket.id);

      const playerCount = roomState.players.size;

      // If host disconnected during game, end game for everyone
      if (roomState.currentRound > 0) {
        const room = await Room.findOne({ where: { code: roomCode } })
        if (room && room.hostId === socket.user?.id) {
          clearRoomTimer(roomState)
          game.to(roomCode).emit("game:over", {
            winner: null,
            finalLeaderboard: buildLeaderboard(roomState),
            reason: "Host left the game",
          })
          await Room.update({ status: "finished" }, { where: { code: roomCode } })
          gameRooms.delete(roomCode)
          console.log(`🚪 Host left — game ended in ${roomCode}`)
          return
        }
      }

      game.to(roomCode).emit("game:player-left", {
        username: socket.user?.username || "Unknown",
        playerCount,
      });

      // Check if all remaining players submitted
      if (roomState.submissions.size >= playerCount && playerCount > 0) {
        clearRoomTimer(roomState);
        game.to(roomCode).emit("game:all-submitted", {
          round: roomState.currentRound,
        });
        game.to(roomCode).emit("game:leaderboard", buildLeaderboard(roomState));
        game.to(roomCode).emit("game:round-end", {
          round: roomState.currentRound,
        });
      }

      // Clean up empty room after a grace period
      if (playerCount === 0) {
        clearRoomTimer(roomState);
        gameRooms.delete(roomCode);
      }
    });
  });

  console.log("✅ Game socket handlers registered on /game namespace");
}

// ── round lifecycle ──────────────────────────────────────────────────────────

/**
 * Advance to the next round (or end the game).
 */
async function advanceToNextRound(game, roomCode, roomState) {
  roomState.currentRound++;
  roomState.submissions.clear();
  roomState.roundReady.clear();
  clearRoomTimer(roomState);

  if (roomState.currentRound > roomState.totalRounds) {
    // Game over
    const leaderboard = buildLeaderboard(roomState);
    const winner = leaderboard.length > 0 ? leaderboard[0] : null;

    game.to(roomCode).emit("game:over", {
      winner: winner ? { username: winner.username, totalScore: winner.totalScore } : null,
      finalLeaderboard: leaderboard,
    });

    // Update room status
    await Room.update({ status: "finished" }, { where: { code: roomCode } });

    // Clean up game state
    gameRooms.delete(roomCode);
    console.log(`🏁 Game over in room ${roomCode}. Winner: ${winner?.username || "none"}`);
    return;
  }

  // Get a random snippet
  const { sequelize } = require("../models/index");
  const snippet = await Snippet.findOne({
    order: [sequelize.literal("RANDOM()")],
    attributes: ["id", "title", "context", "code"],
  });

  if (!snippet) {
    game.to(roomCode).emit("game:error", { message: "No snippets available" });
    return;
  }

  roomState.currentSnippetId = snippet.id;

  // Emit round-start to all players in the room
  game.to(roomCode).emit("game:round-start", {
    round: roomState.currentRound,
    snippet: {
      id: snippet.id,
      title: snippet.title,
      context: snippet.context,
      code: snippet.code,
    },
    timeLimit: roomState.roundDuration,
  });

  console.log(
    `🔄 Round ${roomState.currentRound}/${roomState.totalRounds} started in ${roomCode}`
  );

  // Start server-authoritative timer
  roomState.timer = setTimeout(async () => {
    // Force end round when timer expires
    if (roomState.submissions.size < roomState.players.size) {
      console.log(`⏰ Round ${roomState.currentRound} timer expired in ${roomCode}`);

      // Score any unanswered players as 0
      for (const [sid, player] of roomState.players) {
        if (!roomState.submissions.has(sid)) {
          roomState.submissions.add(sid);

          if (roomState.currentSnippetId) {
            const room = await Room.findOne({ where: { code: roomCode } });
            if (room) {
              await Score.create({
                roomId: room.id,
                userId: player.userId,
                snippetId: roomState.currentSnippetId,
                round: roomState.currentRound,
                score: 0,
                answer: "",
                feedback: "Waktu habis — jawaban tidak dikirim.",
              });
            }
          }

          // Emit 0 score to the player
          game.to(sid).emit("game:score", {
            username: player.username,
            score: 0,
            maxScore: 0,
            feedback: "Waktu habis — jawaban tidak dikirim.",
            bugsFound: [],
            bugsPartial: [],
            bugsMissed: [],
          });
        }
      }

      // Broadcast leaderboard
      game.to(roomCode).emit("game:all-submitted", {
        round: roomState.currentRound,
      });
      game.to(roomCode).emit("game:leaderboard", buildLeaderboard(roomState));
      game.to(roomCode).emit("game:round-end", {
        round: roomState.currentRound,
      });

      // Auto-advance after 3s (client may not send game:ready)
      setTimeout(() => advanceToNextRound(game, roomCode, roomState), 3000);
    }
  }, roomState.roundDuration * 1000);
}

/**
 * Exported for use by REST endpoints (room start triggers game:started).
 * Called after the REST POST /rooms/:code/start marks room as playing.
 *
 * @param {import("socket.io").Namespace} game  - /game namespace
 * @param {string} roomCode                      - room code
 * @param {object} [opts]                        - overrides
 * @param {number} [opts.totalRounds]
 * @param {number} [opts.roundDuration]
 */
async function startGame(game, roomCode, opts = {}) {
  const roomState = getOrCreateRoomState(roomCode, opts);

  // Emit game:started to all in room
  game.to(roomCode).emit("game:started", {
    totalRounds: roomState.totalRounds,
    roundDuration: roomState.roundDuration,
  });

  // Start round 1
  await advanceToNextRound(game, roomCode, roomState);
}

/**
 * Get the current leaderboard for a room (used by REST endpoint).
 */
function getLeaderboard(roomCode) {
  const roomState = gameRooms.get(roomCode);
  if (!roomState) return [];
  return buildLeaderboard(roomState);
}

/**
 * Get final results for a room (used by REST endpoint).
 */
function getResults(roomCode) {
  const roomState = gameRooms.get(roomCode);
  if (!roomState) return null;

  const leaderboard = buildLeaderboard(roomState);
  const winner = leaderboard.length > 0 ? leaderboard[0] : null;

  return {
    winner: winner ? { username: winner.username, totalScore: winner.totalScore } : null,
    finalLeaderboard: leaderboard,
    rounds: roomState.currentRound,
  };
}

module.exports = {
  setupGameHandlers,
  startGame,
  getLeaderboard,
  getResults,
  gameRooms,
};
