const { io: Client } = require("socket.io-client")
const app = require("../../app")
const { setupDB, teardownDB } = require("../helpers/db")
const request = require("supertest")
const { signToken } = require("../../helpers/jwt")

const httpServer = app.server
let httpServerAddr = null

beforeAll(async () => {
  await setupDB()

  // Register a test user for socket auth
  await request(app)
    .post("/api/auth/register")
    .send({ username: "socket_tester", password: "pass123" })

  await new Promise((resolve) => {
    httpServer.listen(() => {
      const { port } = httpServer.address()
      httpServerAddr = `http://localhost:${port}`
      resolve()
    })
  })
})

afterAll(async () => {
  await new Promise((resolve) => {
    const t = setTimeout(() => resolve(), 2000)
    httpServer.close(() => {
      clearTimeout(t)
      resolve()
    })
  })
  await teardownDB()
}, 20000)

describe("Socket.IO — /game namespace", () => {
  test("client connects to /game namespace with auth token", (done) => {
    const token = signToken({ id: 1, username: "socket_tester" })
    const socket = Client(`${httpServerAddr}/game`, {
      transports: ["websocket"],
      timeout: 5000,
      auth: { token },
    })

    socket.on("connect", () => {
      expect(socket.connected).toBe(true)
      socket.disconnect()
      done()
    })

    socket.on("connect_error", (err) => {
      done(err)
    })
  })

  test("client can join a room via game:join", (done) => {
    const token = signToken({ id: 1, username: "socket_tester" })
    const socket = Client(`${httpServerAddr}/game`, {
      transports: ["websocket"],
      timeout: 5000,
      auth: { token },
    })

    socket.on("connect", () => {
      socket.emit("game:join", { roomCode: "TEST01" })
      socket.disconnect()
      done()
    })

    socket.on("connect_error", (err) => {
      done(err)
    })
  })

  test("client receives game:started broadcast after starting room via REST", (done) => {
    let roomCode = null

    setTimeout(async () => {
      const credentials = { username: "broadcast_test", password: "pass123" }
      await request(app).post("/api/auth/register").send(credentials)
      const login = await request(app).post("/api/auth/login").send(credentials)
      const token = login.body.access_token

      const room = await request(app)
        .post("/api/rooms")
        .set("Authorization", `Bearer ${token}`)
      roomCode = room.body.code

      const socket = Client(`${httpServerAddr}/game`, {
        transports: ["websocket"],
        timeout: 5000,
        auth: { token },
      })

      socket.on("connect", () => {
        socket.emit("game:join", { roomCode })
      })

      socket.on("game:started", (data) => {
        expect(data).toHaveProperty("status", "playing")
        socket.disconnect()
        done()
      })

      socket.on("connect_error", (err) => {
        done(err)
      })

      setTimeout(() => {
        request(app)
          .post(`/api/rooms/${roomCode}/start`)
          .set("Authorization", `Bearer ${token}`)
          .end(() => {})
      }, 300)
    }, 500)
  }, 15000)
})
