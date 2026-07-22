const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");
const AuthController = require("./controllers/authController");
const errorHandler = require("./middlewares/errorHandler");

// Middlewares (cors, urlencoded, json)
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Login
app.post("/login", AuthController.login);
app.post("/register", AuthController.register);

// Middlewares ( Error Handler )
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
