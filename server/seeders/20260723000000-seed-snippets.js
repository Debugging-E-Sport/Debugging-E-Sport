"use strict"

const fs = require("fs")
const path = require("path")

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const snippets = JSON.parse(
      fs.readFileSync(path.join(__dirname, "..", "data", "snippets.json"), "utf-8")
    )

    const rows = snippets.map((snippet) => ({
      title: snippet.title,
      context: snippet.context,
      code: snippet.code,
      bugDescriptions: JSON.stringify(snippet.bug_descriptions),
      maxScore: snippet.max_score,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    await queryInterface.bulkInsert("Snippets", rows)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Snippets", null, {})
  },
}
