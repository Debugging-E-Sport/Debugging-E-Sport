const request = require("supertest")
const app = require("../../app")
const { setupDB, teardownDB } = require("../helpers/db")

describe("Snippets API", () => {
  beforeAll(async () => {
    await setupDB()
  })

  afterAll(async () => {
    await teardownDB()
  })

  test("GET /api/snippets/random — returns snippet without bugDescriptions", async () => {
    const res = await request(app).get("/api/snippets/random")

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("title")
    expect(res.body).toHaveProperty("context")
    expect(res.body).toHaveProperty("code")
    expect(res.body).toHaveProperty("max_score")
    expect(res.body).not.toHaveProperty("bugDescriptions")
    expect(res.body).not.toHaveProperty("bug_descriptions")
  })

  test("GET /api/snippets/:id — returns specific snippet", async () => {
    const res = await request(app).get("/api/snippets/1")

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("id", 1)
    expect(res.body).toHaveProperty("title")
    expect(res.body).not.toHaveProperty("bugDescriptions")
  })

  test("GET /api/snippets/:id — non-existent ID returns 404", async () => {
    const res = await request(app).get("/api/snippets/999")

    expect(res.status).toBe(404)
  })

  test("GET /api/snippets/:id — non-numeric ID returns 400", async () => {
    const res = await request(app).get("/api/snippets/abc")

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/invalid/i)
  })

  test("GET /api/snippets — returns array with only id and title", async () => {
    const res = await request(app).get("/api/snippets")

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBeGreaterThanOrEqual(2)

    const first = res.body[0]
    expect(first).toHaveProperty("id")
    expect(first).toHaveProperty("title")
    expect(first).not.toHaveProperty("code")
    expect(first).not.toHaveProperty("context")
    expect(first).not.toHaveProperty("bugDescriptions")
  })
})
