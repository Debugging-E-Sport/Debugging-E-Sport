const generateUniqueCode = async () => {
  const { Room } = require("../models/index");
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let isUnique = false;
  let code = "";

  while (!isUnique) {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    const existingRoom = await Room.findOne({ where: { code } });

    if (!existingRoom) {
      isUnique = true;
    }
  }

  return code;
};

module.exports = generateUniqueCode;
