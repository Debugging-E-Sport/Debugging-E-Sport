const { Snippet, sequelize } = require("../models/index");

class SnippetsController {
  // 1. GET /snippets/random
  static async getRandomSnippet(req, res, next) {
    try {
      const snippet = await Snippet.findOne({
        order: [sequelize.literal("RANDOM()")],
        attributes: ["id", "title", "context", "code", "maxScore"],
      });

      if (!snippet) {
        return res.status(404).json({ message: "No snippets found" });
      }

      return res.status(200).json({
        id: snippet.id,
        title: snippet.title,
        context: snippet.context,
        code: snippet.code,
        max_score: snippet.maxScore,
      });
    } catch (error) {
      next(error);
    }
  }

  // 2. GET /snippets/:id
  static async getSnippetById(req, res, next) {
    try {
      const { id } = req.params;

      const snippet = await Snippet.findByPk(id, {
        attributes: ["id", "title", "context", "code", "maxScore"],
      });

      if (!snippet) {
        return res.status(404).json({ message: "Snippet Not Found" });
      }

      return res.status(200).json({
        id: snippet.id,
        title: snippet.title,
        context: snippet.context,
        code: snippet.code,
        max_score: snippet.maxScore,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. GET /snippets
  static async getAllSnippets(req, res, next) {
    try {
      const snippets = await Snippet.findAll({
        attributes: ["id", "title"],
        order: [["id", "ASC"]],
      });

      return res.status(200).json(snippets);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = SnippetsController;
