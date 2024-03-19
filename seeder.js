const dotenv = require("dotenv");
dotenv.config();

const db = require("./app/models");

// drop the table if it already exists
db.sequelize.sync({ force: true }).then(() => {
  addUser();
});

async function addUser() {
  try {
    const bcrypt = require("bcrypt");
    const User = db.users;
    for (let x = 0; x < 10; x++) {
      const hashedPassword = await bcrypt.hash("test123", 10);
      const payload = {
        name: "Ferenyr " + x,
        username: "ferenyr" + x,
        password: hashedPassword,
        roleId: 0,
      };
      User.create(payload);
    }
  } catch (error) {}
}
