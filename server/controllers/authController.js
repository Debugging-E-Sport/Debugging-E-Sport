const { User } = require("../models/index");
const { signToken } = require("../helpers/jwt");
const { check } = require("../helpers/bycprt");
class AuthController {
  static async register(req, res, next) {
    try {
      const { username, password } = req.body;

      const user = await User.create({ username, password });

      res.status(201).json({
        id: user.id,
        username: user.username,
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
      if (!check(password, user.password)) throw { name: "userNotFound" };

      const payload = {
        id: user.id,
        username: user.username,
      };

      const access_token = signToken(payload);

      res.status(200).json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  static async me(req, res, next) {
    try {
      const user = req.loginInfo;

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
