const dotenv = require("dotenv");
dotenv.config();
const dbConfig = require("./app/config/db.config.js");
const fs = require("fs");

let db = {};
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Provide the path to your SQL file
const filePath = "latihan/soalcreate.sql";
const filePath2 = "latihan/create.sql";

async function executeSQLFile1(filePath) {
  try {
    const sql = fs.readFileSync(filePath, "utf8");
    await sequelize.query(sql);
    console.log("Table created successfully.");
    executeSQLFile2(filePath2);
  } catch (error) {
    console.error("Error executing SQL file:", error);
  }
}

async function executeSQLFile2(filePath) {
  try {
    // Read the SQL file
    const sql = fs.readFileSync(filePath, "utf8");

    // Execute the SQL query
    await sequelize.query(sql);

    console.log("SQL file executed successfully.");
  } catch (error) {
    console.error("Error executing SQL file:", error);
  }
}

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  executeSQLFile1(filePath);
});
