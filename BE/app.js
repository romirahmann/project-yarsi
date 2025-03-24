require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { connectDB } = require("./src/database/db.config");
const { connectDB2 } = require("./src/database/update.config");
const mainRoutes = require("./src/routes/routes");

const app = express();
const server = createServer(app); // Buat HTTP Server

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*", // Atau ganti dengan "http://192.168.9.192:3000" jika hanya untuk frontend tertentu
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({ extended: true }));

// Koneksi Database sebelum server berjalan
Promise.all([connectDB(), connectDB2()])
  .then(() => {
    console.log("✅ All Database connections established");

    // Route Utama
    app.get("/", (req, res) => {
      res.status(200).json({
        status: true,
        service: "Backend Project Starter Kit with WebSocket",
      });
    });

    // API Routes
    app.use("/api", mainRoutes);

    // 404 Not Found Middleware
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: "Endpoint not found",
      });
    });

    // Jalankan server setelah database terkoneksi
    const PORT = process.env.PORT || 8800;
    server.listen(PORT, () => {
      console.log(
        `🚀 Backend is Running on PORT: ${PORT} ${
          process.env.DEV === "TRUE" ? "<Development Mode>" : ""
        }`
      );
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  });

// Ekspor server untuk keperluan lain jika dibutuhkan
module.exports = { app, server };
