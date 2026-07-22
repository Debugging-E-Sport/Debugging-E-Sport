/**
 * @swagger
 * components:
 *   schemas:
 *     Player:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         username:
 *           type: string
 *           example: ByteHunter
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         code:
 *           type: string
 *           example: BX7291
 *         host_id:
 *           type: integer
 *           example: 1
 *         status:
 *           type: string
 *           example: waiting
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-23T04:00:00.000Z"
 *         players:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Player'
 */

const express = require("express");
const RoomController = require("../controllers/roomController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Buat room baru (host auto-join sebagai player)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Room berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 code:
 *                   type: string
 *                   example: BX7291
 *                 host_id:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: waiting
 *                 created_at:
 *                   type: string
 *                   example: "2026-07-23T04:00:00.000Z"
 *       401:
 *         description: Token tidak valid
 */
router.post("/api/rooms", authentication, RoomController.createRoom);

/**
 * @swagger
 * /api/rooms/{code}:
 *   get:
 *     summary: Dapatkan info room beserta daftar player
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: BX7291
 *         description: 6-char room code
 *     responses:
 *       200:
 *         description: Info room
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 code:
 *                   type: string
 *                   example: BX7291
 *                 host_id:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: waiting
 *                 players:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *                 created_at:
 *                   type: string
 *                   example: "2026-07-23T04:00:00.000Z"
 *       404:
 *         description: Room tidak ditemukan
 */
router.get("/api/rooms/:code", RoomController.getRoomByCode);

/**
 * @swagger
 * /api/rooms/{code}/join:
 *   post:
 *     summary: Gabung ke room yang sudah ada
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: BX7291
 *     responses:
 *       200:
 *         description: Berhasil gabung
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 room_id:
 *                   type: integer
 *                   example: 1
 *                 code:
 *                   type: string
 *                   example: BX7291
 *                 players:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Player'
 *       400:
 *         description: Game sudah dimulai
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: Room tidak ditemukan
 */
router.post("/api/rooms/:code/join", authentication, RoomController.joinRoom);

/**
 * @swagger
 * /api/rooms/{code}/start:
 *   post:
 *     summary: Mulai game (hanya host)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *           example: BX7291
 *     responses:
 *       200:
 *         description: Game dimulai
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: playing
 *                 started_at:
 *                   type: string
 *                   example: "2026-07-23T04:01:00.000Z"
 *                 room_id:
 *                   type: integer
 *                   example: 1
 *                 code:
 *                   type: string
 *                   example: BX7291
 *       400:
 *         description: Game sudah berjalan
 *       403:
 *         description: Bukan host
 */
router.post("/api/rooms/:code/start", authentication, RoomController.startRoom);

module.exports = router;
