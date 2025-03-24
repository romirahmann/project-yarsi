const odbc = require("odbc");
const path = require("path"); // Pastikan import path dengan benar

// Path absolut ke file MDB di dalam proyek
const dbDataPath = path.resolve(__dirname, "../uploads/dbData.mdb");
const dbQtyPath = path.resolve(__dirname, "../uploads/dbQty.mdb");
const dbPassword = "adi121711";

// Konfigurasi koneksi ODBC menggunakan file path
const connectionStringData = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbDataPath};PWD=${dbPassword};`;
const connectionStringQty = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbQtyPath};PWD=${dbPassword};`;

let dbData, dbQty;

async function connectDB2() {
  try {
    dbData = await odbc.connect(connectionStringData);
    dbQty = await odbc.connect(connectionStringQty);
    console.log("✅ Database dbData.mdb & dbQty.mdb connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

const getDBData = () => {
  if (!dbData) {
    throw new Error(
      "Database dbData.mdb not connected. Call connectDB2() first."
    );
  }
  return dbData;
};

const getDBQty = () => {
  if (!dbQty) {
    throw new Error(
      "Database dbQty.mdb not connected. Call connectDB2() first."
    );
  }
  return dbQty;
};

module.exports = { connectDB2, getDBData, getDBQty };
