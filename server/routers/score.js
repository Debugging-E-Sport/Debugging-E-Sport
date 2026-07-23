/**
 * Scoring REST Endpoints — REST fallback for scoring, leaderboard, and results.
 *
 * POST /api/scores/submit          — Submit answer, get AI score (REST fallback)
 * GET  /api/rooms/:code/leaderboard — Current leaderboard for a room
 * GET  /api/rooms/:code/results     — Final results after game over
 */

const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/authentication");
const { scoreAnswer } = require("../helpers/aiScoring");
const { Score, Room, User, RoomParticipants, Snippet, sequelize } = require("../models/index");

/**
 * @swagger
 * /api/scores/submit:
 *   post:
 *     summary: Submit jawaban dan dapatkan AI score (REST fallback)
 *     tags: [Scoring]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomCode
 *               - snippetId
 *               - answer
 *             properties:
 *               roomCode:
 *                 type: string
 *                 example: BX7291
 *               snippetId:
 *                 type: integer
 *                 example: 1
 *               answer:
 *                 type: string
 *                 example: "Bug pada baris 5: type coercion..."
 *     responses:
 *       200:
 *         description: Scoring result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 score:
 *                   type: integer
 *                 maxScore:
 *                   type: integer
 *                 feedback:
 *                   type: string
 *                 bugsFound:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bugsPartial:
 *                   type: array
 *                   items:
 *                     type: string
 *                 bugsMissed:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post("/api/scores/submit", authentication, async (req, res, next) => {
  try {
    const { roomCode, snippetId, answer } = req.body;

    if (!roomCode || !snippetId) {
      return res.status(400).json({ message: "roomCode and snippetId are required" });
    }

    // Validate room exists
    const room = await Room.findOne({ where: { code: roomCode } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Validate snippet exists
    const snippet = await Snippet.findByPk(snippetId);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    // Score via AI pipeline
    const result = await scoreAnswer({ snippetId, answer });

    // Save score to DB
    await Score.create({
      roomId: room.id,
      userId: req.loginInfo.id,
      snippetId,
      round: 0, // REST fallback — round is 0 (not in active socket round)
      score: result.score,
      answer: answer || "",
      feedback: result.feedback,
    });

    return res.status(200).json({
      score: result.score,
      maxScore: result.maxScore,
      feedback: result.feedback,
      bugsFound: result.bugsFound,
      bugsPartial: result.bugsPartial,
      bugsMissed: result.bugsMissed,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/rooms/{code}/leaderboard:
 *   get:
 *     summary: Dapatkan leaderboard terkini untuk room
 *     tags: [Scoring]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Room code
 *     responses:
 *       200:
 *         description: Leaderboard array
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   username:
 *                     type: string
 *                   totalScore:
 *                     type: integer
 */
router.get("/api/rooms/:code/leaderboard", async (req, res, next) => {
  try {
    const { code } = req.params;

    const room = await Room.findOne({ where: { code } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // Aggregate scores per user for this room
    const scores = await Score.findAll({
      where: { roomId: room.id },
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("score")), "totalScore"],
      ],
      group: ["Score.userId", "user.id", "user.username"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      order: [[sequelize.literal('SUM("score")'), "DESC"]],
      raw: true,
      nest: true,
    });

    const leaderboard = scores.map((s) => ({
      username: s.user ? s.user.username : "Unknown",
      totalScore: parseInt(s.totalScore, 10) || 0,
    }));

    // Also merge in-game state if available
    const { getLeaderboard } = require("../socket/gameHandler");
    const liveLeaderboard = getLeaderboard(code);
    if (liveLeaderboard.length > 0) {
      // Live leaderboard takes precedence when game is active
      return res.status(200).json(liveLeaderboard);
    }

    return res.status(200).json(leaderboard);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/rooms/{code}/results:
 *   get:
 *     summary: Dapatkan hasil akhir room (setelah game over)
 *     tags: [Scoring]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Room code
 *     responses:
 *       200:
 *         description: Final results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 winner:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     totalScore:
 *                       type: integer
 *                 finalLeaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       username:
 *                         type: string
 *                       totalScore:
 *                         type: integer
 *                 rounds:
 *                   type: integer
 */
router.get("/api/rooms/:code/results", async (req, res, next) => {
  try {
    const { code } = req.params;

    const room = await Room.findOne({ where: { code } });
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const { getResults } = require("../socket/gameHandler");
    const liveResults = getResults(code);
    if (liveResults) {
      return res.status(200).json(liveResults);
    }

    // Fallback: compute from DB
    const scores = await Score.findAll({
      where: { roomId: room.id },
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("score")), "totalScore"],
      ],
      group: ["Score.userId", "user.id", "user.username"],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
      ],
      order: [[sequelize.literal('SUM("score")'), "DESC"]],
      raw: true,
      nest: true,
    });

    const leaderboard = scores.map((s) => ({
      username: s.user ? s.user.username : "Unknown",
      totalScore: parseInt(s.totalScore, 10) || 0,
    }));

    const winner = leaderboard.length > 0 ? leaderboard[0] : null;

    return res.status(200).json({
      winner,
      finalLeaderboard: leaderboard,
      rounds: room.status === "finished" ? 5 : 0,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
