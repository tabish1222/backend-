// src/config/mongo.js
const mongoose = require("mongoose");
const logger = require("../utils/logger");

async function connectMongo() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("❌ MONGO_URI not set in environment variables");
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    logger.info("✅ MongoDB connected successfully");
  } catch (err) {
    logger.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = connectMongo;
