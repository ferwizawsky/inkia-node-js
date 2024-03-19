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

const penjualan = sequelize.define("penjualan", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  tanggal: {
    type: Sequelize.STRING,
  },
  jumlah: {
    type: Sequelize.BIGINT,
  },
});

const produk = sequelize.define("produk", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.BIGINT,
  },
  nama: {
    type: Sequelize.STRING,
  },
  code: {
    type: Sequelize.STRING,
  },
});

const kategori = sequelize.define("kategori", {
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

db.kategori = kategori;
db.produk = produk;
db.penjualan = penjualan;

db.kategori.hasMany(db.produk, { as: "produks" });
db.produk.hasMany(db.penjualan, { as: "penjualans" });
db.produk.belongsTo(db.kategori, {
  foreignKey: "kategoriId",
  as: "kategori",
});
db.penjualan.belongsTo(db.produk, {
  foreignKey: "produkId",
  as: "produk",
});

async function nambahData() {
  try {
    await db.kategori.create({
      nama: "Elektronik",
    });
    await db.kategori.create({
      nama: "Perlengkapan",
    });
    await db.produk.create({
      nama: "Laptop",
      kategoriId: 1,
    });
    await db.produk.create({
      nama: "HP",
      kategoriId: 1,
    });
    await db.produk.create({
      nama: "printer",
      kategoriId: 2,
    });
    await db.penjualan.create({
      tanggal: "01/10/2023",
      code: "A",
      produkId: 1,
      jumlah: 5000,
    });
    await db.penjualan.create({
      tanggal: "02/10/2023",
      code: "C",
      produkId: 3,
      jumlah: 5000,
    });
    await db.penjualan.create({
      tanggal: "02/10/2023",
      code: "B",
      produkId: 2,
      jumlah: 3000,
    });

    getTotalSalesPerCategory();
  } catch (error) {}
}

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
  // addUser();
  nambahData();
});

async function getTotalSalesPerCategory() {
  try {
    const result = await penjualan.findAll({
      include: [
        {
          model: db.produk,
          as: "produk",
          include: [
            {
              model: db.kategori,
              as: "kategori",
              attributes: ["nama"],
            },
          ],
        },
      ],
      attributes: [
        [sequelize.fn("SUM", sequelize.col("jumlah")), "totalSales"],
      ],
      group: ["produk.kategori.nama"], // Group by category name
    });

    console.log("Total Sales per Category:");
    result.forEach((row) => {
      console.log(row);
      // console.log(`${row.db.produk.kategori}: ${row.dataValues.totalSales}`);
    });
  } catch (error) {
    console.error("Error fetching total sales per category:", error);
  }
}
