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
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Type Coercion in Addition
 *                 context:
 *                   type: string
 *                   example: Fungsi ini seharusnya menghitung total dari dua angka dan menampilkan hasilnya.
 *                 code:
 *                   type: string
 *                   example: |
 *                     function add(a, b) {
 *                       return a + b
 *                     }
 *                     const total = add(5, "10")
 *                     console.log("Total:", total)
 *                 max_score:
 *                   type: integer
 *                   example: 100
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
 *           example: 1
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
 *                   example: 1
 *                 title:
 *                   type: string
 *                   example: Type Coercion in Addition
 *                 context:
 *                   type: string
 *                   example: Fungsi ini seharusnya menghitung total dari dua angka dan menampilkan hasilnya.
 *                 code:
 *                   type: string
 *                   example: |
 *                     function add(a, b) {
 *                       return a + b
 *                     }
 *                     const total = add(5, "10")
 *                     console.log("Total:", total)
 *                 max_score:
 *                   type: integer
 *                   example: 100
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
 *                     example: 1
 *                   title:
 *                     type: string
 *                     example: Type Coercion in Addition
 */
router.get("/api/snippets", SnippetsController.getAllSnippets);

module.exports = router;
