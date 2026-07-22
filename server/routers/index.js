const express = require("express");
const router = express.Router();
const auth = require("./auth");
const room = require("./room");

router.use(auth);
router.use(room);

module.exports = router;
