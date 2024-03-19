const express = require("express");
const cors = require("cors");
const app = express();
const expressValidator = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

var corsOptions = {
  origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(expressValidator());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db.sequelize.sync()
// .then(() => {
//   console.log("Synced db.");
// })
// .catch((err) => {
//   console.log("Failed to sync db: " + err.message);
// });
app.get("/", (req, res) => {
  console.log(res);
  return res.json({
    message: "Hello There",
  });
});

require("./app/routes/auth.routes")(app);
require("./app/routes/turorial.routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
