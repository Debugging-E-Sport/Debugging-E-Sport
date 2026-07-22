"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Snippet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Snippet.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      context: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      code: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      bugDescriptions: {
        type: DataTypes.TEXT,
        allowNull: false,
        get() {
          const rawValue = this.getDataValue("bugDescriptions");
          return rawValue ? JSON.parse(rawValue) : [];
        },
        set(value) {
          this.setDataValue("bugDescriptions", JSON.stringify(value));
        },
      },
      maxScore: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Snippet",
    },
  );
  return Snippet;
};
