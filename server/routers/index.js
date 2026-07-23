const express = require("express");
const router = express.Router();
const auth = require("./auth");
const room = require("./room");
const snippet = require("./snippet");
const score = require("./score");

router.use(auth);
router.use(room);
router.use(snippet);
router.use(score);

module.exports = router;
