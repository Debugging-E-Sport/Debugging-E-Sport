"use strict";
const { Model } = require("sequelize");
const generateUniqueCode = require("../helpers/codeRandom");
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: "hostId", as: "host" });
      this.hasMany(models.Score, { foreignKey: "roomId" });
      this.belongsToMany(models.User, {
        through: models.RoomParticipants,
        foreignKey: "roomId",
        as: "players",
      });
    }
  }
  Room.init(
    {
      hostId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: "waiting",
      },
    },
    {
      hooks: {
        beforeCreate: (room, options) => {
          if (!room.code) {
            room.code = generateUniqueCode();
          }
        },
      },
      sequelize,
      modelName: "Room",
    },
  );
  return Room;
};
