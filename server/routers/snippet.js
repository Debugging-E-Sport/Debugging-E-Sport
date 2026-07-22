const express = require("express");
const SnippetsController = require("../controllers/snippetsController");
const router = express.Router();

router.get("/api/snippets/random", SnippetsController.getRandomSnippet);
router.get("/api/snippets/:id", SnippetsController.getSnippetById);
router.get("/api/snippets", SnippetsController.getAllSnippets);

// Fallback mappings without /api prefix
router.get("/snippets/random", SnippetsController.getRandomSnippet);
router.get("/snippets/:id", SnippetsController.getSnippetById);
router.get("/snippets", SnippetsController.getAllSnippets);

module.exports = router;
