const generateUniqueCode = require("../helpers/codeRandom");
const { Room, User, RoomParticipants } = require("../models/index");

class RoomController {
  // 1. POST /rooms (Membuat room baru)
  static async createRoom(req, res, next) {
    try {
      const hostId = req.loginInfo.id;

      const code = generateUniqueCode();

      const newRoom = await Room.create({
        hostId,
        code,
        status: "waiting",
      });

      await RoomParticipants.create({ roomId: newRoom.id, userId: hostId });

      return res.status(201).json({
        id: newRoom.id,
        code: newRoom.code,
        host_id: newRoom.hostId,
        status: newRoom.status,
        created_at: newRoom.createdAt,
      });
    } catch (err) {
      next(err);
    }
  }

  // 2. POST /rooms/:code/join (Gabung ke dalam room)
  static async joinRoom(req, res, next) {
    try {
      const { code } = req.params;
      const userId = req.loginInfo?.id;

      const room = await Room.findOne({ where: { code } });
      if (!room) {
        throw { name: "RoomNotFound" };
      }

      if (room.status !== "waiting") {
        throw { name: "GameAlreadyStarted" };
      }

      await RoomParticipants.findOrCreate({
        where: { roomId: room.id, userId },
        defaults: { roomId: room.id, userId },
      });

      const updatedRoom = await Room.findOne({
        where: { code },
        include: [
          {
            model: User,
            as: "players",
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
          {
            model: User,
            as: "host",
            attributes: ["id", "username"],
          },
        ],
      });

      res.status(200).json({
        room_id: updatedRoom.id,
        code: updatedRoom.code,
        players: updatedRoom.players,
      });
    } catch (error) {
      next(error);
    }
  }

  // 3. GET /rooms/:code (Mendapatkan info room + list player)
  static async getRoomByCode(req, res, next) {
    try {
      const { code } = req.params;

      const room = await Room.findOne({
        where: { code },
        attributes: ["id", "code", "hostId", "status", "createdAt"],
        include: [
          {
            model: User,
            as: "players",
            attributes: ["id", "username"],
            through: { attributes: [] },
          },
        ],
      });

      if (!room) {
        throw { name: "RoomNotFound" };
      }

      res.status(200).json({
        id: room.id,
        code: room.code,
        host_id: room.hostId,
        status: room.status,
        players: room.players,
        created_at: room.createdAt,
      });
    } catch (error) {
      next(error);
    }
  }
  // 4. PATCH /rooms/:code/start (Trigger game start - Khusus Host)
  static async startRoom(req, res, next) {
    try {
      const { code } = req.params;
      const currentUserId = req.loginInfo?.id;

      const room = await Room.findOne({ where: { code } });
      if (!room) {
        throw { name: "RoomNotFound" };
      }

      if (room.hostId !== currentUserId) {
        throw {
          name: "Forbidden",
          message: "Access denied: Only the host can start the game.",
        };
      }

      if (room.status === "playing") {
        return res.status(200).json({
          message: "Game is already in progress",
          status: room.status,
        });
      }

      await room.update({ status: "playing" });

      const io = req.app.get("io");
      if (io) {
        io.to(code).emit("game:started", {
          status: "playing",
          message: "The host has started the game! Get ready.",
        });
      }

      return res.status(200).json({
        status: room.status,
        started_at: room.updatedAt,
        room_id: room.id,
        code: room.code,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RoomController;
