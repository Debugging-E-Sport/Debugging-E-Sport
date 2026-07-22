const express = require("express");
const RoomController = require("../controllers/roomController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.use(authentication);
router.post("/api/rooms", RoomController.createRoom);
router.post("/api/rooms/:code/join", RoomController.joinRoom);
router.get("/api/rooms/:code", (req, res) => {
  res.send("Test Success");
});
router.post("/api/rooms/:code/start", (req, res) => {
  res.send("Test Success");
});

module.exports = router;
