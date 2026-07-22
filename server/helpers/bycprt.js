const bcrypt = require("bcryptjs");

const hash = (password) => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

const chek = (password, passwordUser) => {
  return bcrypt.compareSync(password, passwordUser);
};

module.exports = { hash, chek };
