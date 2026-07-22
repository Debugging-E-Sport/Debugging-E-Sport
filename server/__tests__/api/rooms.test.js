const request = require("supertest")
const app = require("../../app")
const { setupDB, teardownDB } = require("../helpers/db")

describe("Rooms API", () => {
  let aliceToken = null
  let bobToken = null
  let roomCode = null

  beforeAll(async () => {
    await setupDB()

    await request(app).post("/api/auth/register").send({ username: "alice_host", password: "pass123" })
    const aliceRes = await request(app).post("/api/auth/login").send({ username: "alice_host", password: "pass123" })
    aliceToken = aliceRes.body.access_token

    await request(app).post("/api/auth/register").send({ username: "bob_player", password: "pass123" })
    const bobRes = await request(app).post("/api/auth/login").send({ username: "bob_player", password: "pass123" })
    bobToken = bobRes.body.access_token
  })

  afterAll(async () => {
    await teardownDB()
  })

  test("POST /api/rooms — creates room and auto-joins host as player", async () => {
    const res = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`)

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty("id")
    expect(res.body).toHaveProperty("code")
    expect(res.body.code).toHaveLength(6)
    expect(res.body).toHaveProperty("host_id")
    expect(res.body).toHaveProperty("status", "waiting")
    expect(res.body).toHaveProperty("created_at")
    roomCode = res.body.code
  })

  test("POST /api/rooms — without auth returns 401", async () => {
    const res = await request(app)
      .post("/api/rooms")

    expect(res.status).toBe(401)
  })

  test("GET /api/rooms/:code — returns room info with host in players list", async () => {
    const res = await request(app)
      .get(`/api/rooms/${roomCode}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("code", roomCode)
    expect(res.body).toHaveProperty("host_id")
    expect(res.body).toHaveProperty("players")
    expect(res.body.players.some((p) => p.username === "alice_host")).toBe(true)
  })

  test("POST /api/rooms/:code/join — bob joins the room", async () => {
    const res = await request(app)
      .post(`/api/rooms/${roomCode}/join`)
      .set("Authorization", `Bearer ${bobToken}`)

    expect(res.status).toBe(200)
    expect(res.body.players.some((p) => p.username === "bob_player")).toBe(true)
  })

  test("POST /api/rooms/:code/join — duplicate join does not duplicate player", async () => {
    const res = await request(app)
      .post(`/api/rooms/${roomCode}/join`)
      .set("Authorization", `Bearer ${bobToken}`)

    expect(res.status).toBe(200)
    const bobEntries = res.body.players.filter((p) => p.username === "bob_player")
    expect(bobEntries.length).toBe(1)
  })

  test("POST /api/rooms/:code/start — host starts the game", async () => {
    // Create a fresh room since bob already joined the previous one
    const roomRes = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`)
    const startCode = roomRes.body.code

    const res = await request(app)
      .post(`/api/rooms/${startCode}/start`)
      .set("Authorization", `Bearer ${aliceToken}`)

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("status", "playing")
    expect(res.body).toHaveProperty("started_at")
  })

  test("POST /api/rooms/:code/join — cannot join after game started", async () => {
    const roomRes = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`)
    const newCode = roomRes.body.code

    await request(app)
      .post(`/api/rooms/${newCode}/start`)
      .set("Authorization", `Bearer ${aliceToken}`)

    const res = await request(app)
      .post(`/api/rooms/${newCode}/join`)
      .set("Authorization", `Bearer ${bobToken}`)

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/already started/i)
  })

  test("POST /api/rooms/:code/start — non-host cannot start", async () => {
    const roomRes = await request(app)
      .post("/api/rooms")
      .set("Authorization", `Bearer ${aliceToken}`)
    const newCode = roomRes.body.code

    const res = await request(app)
      .post(`/api/rooms/${newCode}/start`)
      .set("Authorization", `Bearer ${bobToken}`)

    expect(res.status).toBe(403)
  })

  test("GET /api/rooms/:code — invalid code returns 404", async () => {
    const res = await request(app).get("/api/rooms/ZZZZZZ")

    expect(res.status).toBe(404)
    expect(res.body.message).toMatch(/not found/i)
  })
})
