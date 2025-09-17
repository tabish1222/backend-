// src/server.js
import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import studentsRouter from "./routes/students.js";
import { sequelize, connectMongo } from "./db.js";
import "./models/index.js";   // ⬅️ ensures associations are loaded

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentsRouter);

// Health check
app.get("/", (req, res) => {
  res.send("✅ School backend is running");
});

// Start server after DBs are ready
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");

    await sequelize.sync(); // Auto create tables if missing

    await connectMongo();

    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
