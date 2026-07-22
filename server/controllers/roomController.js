const generateUniqueCode = require("../helpers/codeRandom");
const { Room, User, Score, RoomParticipants } = require("../models/index");

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
  // 4. POST /rooms/:code/start (Trigger game start - Khusus Host)
}

module.exports = RoomController;
