const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

const errorHandler = require("./middlewares/errorHandler");

const router = require("./routers/index");

// Middlewares (cors, urlencoded, json)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Router
app.use(router);

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
