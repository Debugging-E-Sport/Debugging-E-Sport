/**
 * @swagger
 * components:
 *   schemas:
 *     Room:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         host_id:
 *           type: integer
 *         status:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         players:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               username:
 *                 type: string
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
 *                 code:
 *                   type: string
 *                 host_id:
 *                   type: integer
 *                 status:
 *                   type: string
 *                 created_at:
 *                   type: string
 *       401:
 *         description: Token tidak valid
 *       403:
 *         description: Token tidak ditemukan
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
 *         description: 6-char room code
 *     responses:
 *       200:
 *         description: Info room
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Room'
 *       403:
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
 *                 code:
 *                   type: string
 *                 players:
 *                   type: array
 *       400:
 *         description: Game sudah dimulai
 *       401:
 *         description: Token tidak valid
 *       403:
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
 *                 started_at:
 *                   type: string
 *       400:
 *         description: Game sudah berjalan
 *       403:
 *         description: Bukan host atau room tidak ditemukan
 */
router.post("/api/rooms/:code/start", authentication, RoomController.startRoom);

module.exports = router;
