"use strict";
const { Model } = require("sequelize");
const { hash } = require("../helpers/bycprt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Room, { foreignKey: "hostId" });
      this.hasMany(models.Score, { foreignKey: "userId" });
      this.belongsToMany(models.Room, {
        through: models.RoomParticipant,
        foreignKey: "userId",
        as: "joinedRooms",
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: { msg: "username sudah terpakai" },
        validate: {
          notEmpty: { msg: "username is required" },
          notEmpty: { msg: "username is required" },
          len: {
            args: [6, 30],
            msg: "username must be more than 5 characters",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: "password is required" },
          notEmpty: { msg: "password is required" },
        },
      },
    },
    {
      hooks: {
        beforeCreate: (user, options) => {
          // username
          user.username = user.username.replace(/\s+/g, "");

          // password
          user.password = hash(user.password);
        },
      },
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
