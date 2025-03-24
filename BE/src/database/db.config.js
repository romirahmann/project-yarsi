const odbc = require("odbc");
require("dotenv").config();
const path = require("path");

// Path absolut ke file MDB
const dbPath = path.resolve(__dirname, "../database/dbData.mdb");

const dbPassword = "adi121711";

// Konfigurasi koneksi ODBC tanpa DSN
const connectionString = `DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};DBQ=${dbPath};PWD=${dbPassword};`;

let db;

async function connectDB() {
  try {
    db = await odbc.connect(connectionString);
    console.log("✅ Database 1 connected successfully!");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
}

const getDB = () => {
  if (!db) {
    throw new Error("Database not connected. Call connectDB() first.");
  }
  return db;
};

module.exports = { connectDB, getDB };
