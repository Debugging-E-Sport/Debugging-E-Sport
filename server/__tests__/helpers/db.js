const { sequelize, Snippet } = require("../../models")

const TEST_SNIPPETS = [
  {
    title: "Type Coercion in Addition",
    context: "Fungsi ini seharusnya menghitung total dari dua angka dan menampilkan hasilnya.",
    code: "function add(a, b) {\n  return a + b\n}\n\nconst total = add(5, \"10\")\nconsole.log(\"Total:\", total)",
    bugDescriptions: JSON.stringify([
      { id: "b1", description: "Type coercion: string + number results in concatenation", points: 50 },
      { id: "b2", description: "Missing type validation on input parameters", points: 50 },
    ]),
    maxScore: 100,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    title: "Undefined Property Access",
    context: "Kode ini mencoba mengakses port dari object konfigurasi server.",
    code: "const config = {\n  server: {\n    host: 'localhost'\n  }\n}\n\nconst port = config.server.port.toString()\nconsole.log('Port:', port)",
    bugDescriptions: JSON.stringify([
      { id: "b1", description: "config.server.port is undefined because port property does not exist", points: 35 },
    ]),
    maxScore: 70,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

async function setupDB() {
  await sequelize.sync({ force: true })
  await Snippet.bulkCreate(TEST_SNIPPETS)
}

async function teardownDB() {
  await sequelize.close()
}

module.exports = { setupDB, teardownDB }
