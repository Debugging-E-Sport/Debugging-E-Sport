const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const AuthController = require("./controllers/authController");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");
const router = require("./routers/index");

// Middlewares (cors, urlencoded, json)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(router);

// Rooms
app.post("/api/rooms", (req, res) => {
  res.send("Test Success");
});
app.post("/api/rooms/:code/join", (req, res) => {
  res.send("Test Success");
});
app.get("/api/rooms/:code", (req, res) => {
  res.send("Test Success");
});
app.post("/api/rooms/:code/start", (req, res) => {
  res.send("Test Success");
});

// Snippets
app.post("/api/snippets/random", (req, res) => {
  res.send("Test Success");
});
app.post("/api/snippets/:id", (req, res) => {
  res.send("Test Success");
});
app.post("/api/snippets", (req, res) => {
  res.send("Test Success");
});

// Scoring
app.post("/api/scores/submit", (req, res) => {
  res.send("Test Success");
});
app.post("/api/rooms/:code/leaderboard", (req, res) => {
  res.send("Test Success");
});
app.post("/api/rooms/:code/results", (req, res) => {
  res.send("Test Success");
});

// Middlewares ( Error Handler )
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
