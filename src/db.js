// src/db.js
const { Pool } = require("pg");
const { MongoClient } = require("mongodb");
const { Sequelize } = require("sequelize");

const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let mongoClient;
let mongoDb;

async function connectMongo() {
  if (mongoDb) return mongoDb;
  mongoClient = new MongoClient(process.env.MONGO_URI);
  await mongoClient.connect();
  mongoDb = mongoClient.db(process.env.MONGO_DBNAME || "school");
  console.log("Connected to MongoDB");
  return mongoDb;
}

function getMongo() {
  if (!mongoDb) throw new Error("Mongo not connected. Call connectMongo()");
  return mongoDb;
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  ssl: { rejectUnauthorized: false },
  logging: false,
});

module.exports = { pgPool, connectMongo, getMongo, sequelize };
