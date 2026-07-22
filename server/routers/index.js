const express = require("express");
const router = express.Router();
const auth = require("./auth");
const room = require("./room");
const snippet = require("./snippet");

router.use(auth);
router.use(room);
router.use(snippet);

module.exports = router;
