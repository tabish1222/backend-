require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const studentRoutes = require("./routes/student.routes");

const { sequelize } = require("./db"); // ✅ import Sequelize instance

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ School backend is running");
});

// --- Initialize both MongoDB and Sequelize ---
async function startServer() {
  try {
    // MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Sequelize
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL via Sequelize");

    // Sync models
    await sequelize.sync({ alter: true }); // creates tables if they don't exist
    console.log("✅ Sequelize models synced");

    // Start server
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ DB connection error:", err);
    process.exit(1);
  }
}

startServer();
