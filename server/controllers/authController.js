const { where } = require("sequelize");
const { User } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { chek } = require("../helpers/bycprt");
class AuthController {
  static async register(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await User.create({ username, password });

      res.status(201).json({
        message: "register has been successfuly",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { username, password } = req.body;
      if (!username || !password) throw { name: "userNotNull" };

      const user = await User.findOne({ where: { username: username } });
      if (!user) throw { name: "userNotFound" };
      if (!chek(password, user.password)) throw { name: "userNotFound" };

      const payload = {
        id: user.id,
        username: user.username,
      };

      const access_token = signToken(payload);

      res.status(200).json(access_token);
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const user = req.loginInfo;
      console.log(user);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
