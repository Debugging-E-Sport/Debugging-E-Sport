const express = require("express");
const SnippetsController = require("../controllers/snippetsController");
const router = express.Router();

/**
 * @swagger
 * /api/snippets/random:
 *   get:
 *     summary: Dapatkan snippet acak (tanpa kunci jawaban)
 *     tags: [Snippets]
 *     responses:
 *       200:
 *         description: Snippet acak
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 context:
 *                   type: string
 *                 code:
 *                   type: string
 *                 max_score:
 *                   type: integer
 *       404:
 *         description: Tidak ada snippet tersedia
 */
router.get("/api/snippets/random", SnippetsController.getRandomSnippet);

/**
 * @swagger
 * /api/snippets/{id}:
 *   get:
 *     summary: Dapatkan snippet by ID
 *     tags: [Snippets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detail snippet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 title:
 *                   type: string
 *                 context:
 *                   type: string
 *                 code:
 *                   type: string
 *                 max_score:
 *                   type: integer
 *       400:
 *         description: ID tidak valid
 *       404:
 *         description: Snippet tidak ditemukan
 */
router.get("/api/snippets/:id", SnippetsController.getSnippetById);

/**
 * @swagger
 * /api/snippets:
 *   get:
 *     summary: Dapatkan daftar semua snippet (id + title only)
 *     tags: [Snippets]
 *     responses:
 *       200:
 *         description: Array snippet
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 */
router.get("/api/snippets", SnippetsController.getAllSnippets);

// Fallback mappings without /api prefix
router.get("/snippets/random", SnippetsController.getRandomSnippet);
router.get("/snippets/:id", SnippetsController.getSnippetById);
router.get("/snippets", SnippetsController.getAllSnippets);

module.exports = router;
