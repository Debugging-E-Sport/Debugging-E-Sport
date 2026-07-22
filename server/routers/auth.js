const express = require("express");
const AuthController = require("../controllers/authController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/api/auth/login", AuthController.login);
router.post("/api/auth/register", AuthController.register);

router.use(authentication);
router.get("/api/auth/me", AuthController.me);

module.exports = router;
