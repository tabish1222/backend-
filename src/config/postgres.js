// src/config/postgres.js
const { Pool } = require("pg");
const logger = require("../utils/logger"); // if you added logger

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: { rejectUnauthorized: false }, // required for Neon/Render
});

pool.on("connect", () => {
  logger.info("✅ Connected to PostgreSQL");
});

pool.on("error", (err) => {
  logger.error("❌ Unexpected PostgreSQL error", err);
  process.exit(-1);
});

module.exports = pool;
