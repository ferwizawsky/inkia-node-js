const dotenv = require("dotenv");
dotenv.config();
const dbConfig = require("./app/config/db.config.js");

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

const Op = db.Sequelize.Op;
const karyawan = sequelize.define("karyawan", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  nama: {
    type: Sequelize.STRING,
  },
  jabatan: {
    type: Sequelize.STRING,
  },
  gaji: {
    type: Sequelize.BIGINT,
  },
});

const proyek = sequelize.define("proyek", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  nama: {
    type: Sequelize.STRING,
  },
});

db.karyawan = karyawan;
db.proyek = proyek;
db.karyawan.hasMany(db.proyek, { as: "proyeks" });
db.proyek.belongsTo(db.karyawan, {
  foreignKey: "karyawanId",
  as: "karyawan",
});

const Karyawan = db.karyawan;
async function averageSalary() {
  try {
    const [result] = await Karyawan.findAll({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("gaji")), "averageSalary"],
      ],
    });

    const averageSalary = result.dataValues.averageSalary;

    console.log(`Average Salary of all Karyawan: ${averageSalary}`);
  } catch (error) {
    console.error("Error fetching karyawan list:", error);
  }
}
async function displayKaryawanList() {
  try {
    const karyawanList = await Karyawan.findAll({
      include: [
        {
          model: db.proyek,
          as: "proyeks",
        },
      ],
    });
    console.log("List of Karyawan:");
    karyawanList.forEach((karyawan) => {
      console.log(
        `${karyawan.id}: ${karyawan.nama}, ${karyawan.jabatan}, gaji : ${karyawan.gaji} `
      );
      console.log("Project");
      karyawan.proyeks.forEach((proyek) => {
        console.log(`- ${proyek.nama}`);
      });
    });
  } catch (error) {
    console.error("Error fetching karyawan list:", error);
  }
}
averageSalary();
displayKaryawanList();
