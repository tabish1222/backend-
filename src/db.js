import { Pool } from "pg";
import { MongoClient } from "mongodb";

export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
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
