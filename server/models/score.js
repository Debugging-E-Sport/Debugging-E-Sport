"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Score extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Score.belongsTo(models.Room, { foreignKey: "roomId", as: "room" });
      Score.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Score.belongsTo(models.Snippet, {
        foreignKey: "snippetId",
        as: "snippet",
      });
    }
  }
  Score.init(
    {
      roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      snippetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      round: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      feedback: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "Score",
    },
  );
  return Score;
};
