const express = require("express");
const RoomController = require("../controllers/roomController");
const authentication = require("../middlewares/authentication");
const router = express.Router();

router.post("/api/rooms", authentication, RoomController.createRoom);
router.get("/api/rooms/:code", RoomController.getRoomByCode);
router.post("/api/rooms/:code/join", authentication, RoomController.joinRoom);
router.patch("/rooms/:code/start", authentication, RoomController.startRoom);

module.exports = router;
