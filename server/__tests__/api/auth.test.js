const request = require("supertest")
const app = require("../../app")
const { setupDB, teardownDB } = require("../helpers/db")

describe("Auth API", () => {
  const credentials = { username: "testuser", password: "password123" }
  let token = null

  beforeAll(async () => {
    await setupDB()
  })

  afterAll(async () => {})

  test("POST /api/auth/register — returns 201 with id and username", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(credentials)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("username", credentials.username)
  })

  test("POST /api/auth/register — duplicate username returns 409", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send(credentials)

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty("message")
  })

  test("POST /api/auth/register — empty fields returns 400", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "", password: "" })

    expect(res.status).toBe(400)
  })

  test("POST /api/auth/login — returns 200 with access_token", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send(credentials)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("access_token")
    token = res.body.access_token
  })

  test("POST /api/auth/login — wrong password returns 403", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: credentials.username, password: "wrong" })

    expect(res.status).toBe(403)
  })

  test("GET /api/auth/me — with token returns id and username", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("username", credentials.username)
  })

  test("GET /api/auth/me — without token returns 403", async () => {
    const res = await request(app)
      .get("/api/auth/me")

    expect(res.status).toBe(403)
  })
})
