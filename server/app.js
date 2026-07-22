const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const { sequelize } = require("./models");

const { createServer } = require("http");
const { Server } = require("socket.io");
const server = createServer(app);

// Inisialisasi Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  },
});

// agar bisa di req.app.get("io")
const game = io.of("/game");
app.set("io", game);

const router = require("./routers/index");

// Middlewares (cors, urlencoded, json)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
app.use(router);

// TODO: snippets endpoints — implemented in routers/snippet.js
// TODO: scoring endpoints — pending AI scoring pipeline
// TODO: leaderboard endpoint — pending socket server

// Middlewares ( Error Handler )
app.use(errorHandler);

// handle koneksi webSocket
game.on("connection", (socket) => {
  console.log(`⚡ A client connected with socket ID: ${socket.id}`);

  socket.on("game:join", (data) => {
    const { roomCode } = data;
    socket.join(roomCode);
    console.log(`Socket ${socket.id} joined room: ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await sequelize.close();
  server.close();
  process.exit(0);
});

module.exports = app;
app.server = server;
