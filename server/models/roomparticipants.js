"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RoomParticipants extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Room, { foreignKey: "roomId" });
      this.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  RoomParticipants.init(
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RoomParticipants",
    },
  );
  return RoomParticipants;
};
