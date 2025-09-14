// src/db.js
import { Pool } from "pg";
import { MongoClient } from "mongodb";
import { Sequelize } from "sequelize";

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let mongoClient;
let mongoDb;

export async function connectMongo() {
  if (mongoDb) return mongoDb;
  mongoClient = new MongoClient(process.env.MONGO_URI);
  await mongoClient.connect();
  mongoDb = mongoClient.db(process.env.MONGO_DBNAME || "school");
  console.log("Connected to MongoDB");
  return mongoDb;
}

export function getMongo() {
  if (!mongoDb) throw new Error("Mongo not connected. Call connectMongo()");
  return mongoDb;
}

export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
  logging: false,
});
