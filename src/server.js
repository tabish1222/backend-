const express = require("express");
const mongoose = require("mongoose");
const { Pool } = require("pg");
const logger = require("./utils/logger");
require("dotenv").config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 10000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }
});

pool.connect()
  .then(() => logger.info("✅ Connected to PostgreSQL"))
  .catch(err => {
    logger.error("❌ PostgreSQL connection error: " + err.message);
    process.exit(1);
  });

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => logger.info("✅ Connected to MongoDB"))
  .catch(err => {
    logger.error("❌ MongoDB connection error: " + err.message);
    process.exit(1);
  });

// Test route
app.get("/", (req, res) => {
  logger.info("Root route accessed");
  res.send("🎉 Backend is running successfully!");
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
});
