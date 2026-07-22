const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const AuthController = require("./controllers/authController");
const errorHandler = require("./middlewares/errorHandler");
const authentication = require("./middlewares/authentication");

// Middlewares (cors, urlencoded, json)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Auth
app.post("/auth/login", AuthController.login);
app.post("/auth/register", AuthController.register);

// middlewares Authentication
app.use(authentication);
app.get("/auth/me", AuthController.me);

// Rooms
app.post("/rooms", (req, res) => {
  res.send("Test Success");
});
app.post("/rooms/:code/join", (req, res) => {
  res.send("Test Success");
});
app.get("/rooms/:code", (req, res) => {
  res.send("Test Success");
});
app.post("/rooms/:code/start", (req, res) => {
  res.send("Test Success");
});

// Snippets
app.post("/snippets/random", (req, res) => {
  res.send("Test Success");
});
app.post("/snippets/:id", (req, res) => {
  res.send("Test Success");
});
app.post("/snippets", (req, res) => {
  res.send("Test Success");
});

// Scoring
app.post("/scores/submit", (req, res) => {
  res.send("Test Success");
});
app.post("/rooms/:code/leaderboard", (req, res) => {
  res.send("Test Success");
});
app.post("/rooms/:code/results", (req, res) => {
  res.send("Test Success");
});

// Middlewares ( Error Handler )
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
