require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const { sequelize } = require("./models");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bug Brawl API",
      version: "1.0.0",
      description: "REST API untuk platform kompetisi debugging multiplayer real-time",
    },
    servers: [{ url: "http://localhost:3000" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [path.join(__dirname, "routers", "*.js")],
});

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

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// TODO: snippets endpoints — implemented in routers/snippet.js
// TODO: scoring endpoints — pending AI scoring pipeline
// TODO: leaderboard endpoint — pending socket server

// Middlewares ( Error Handler )
app.use(errorHandler);

// Socket.IO game handlers — full game flow: join/leave/submit/ready/rounds/timers
const { setupGameHandlers } = require("./socket/gameHandler");
setupGameHandlers(game);

if (require.main === module) {
  server.listen(port, () => {
    console.log(`Bug Brawl server listening on port ${port}`);
  });
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  await sequelize.close();
  server.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received. Shutting down gracefully...");
  await sequelize.close();
  server.close();
  process.exit(0);
});

module.exports = app;
app.server = server;
