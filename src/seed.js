import dotenv from "dotenv";
import mongoose from "mongoose";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

async function seed() {
  try {
    // PostgreSQL
    const pool = new Pool({
      connectionString: process.env.POSTGRES_URI,
      ssl: { rejectUnauthorized: false }
    });

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        grade VARCHAR(50)
      );
    `);
    console.log("✅ Postgres seeded");

    // MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    const Student = mongoose.model("Student", new mongoose.Schema({ name: String, grade: String }));
    await Student.create({ name: "Test Student", grade: "5" });
    console.log("✅ Mongo seeded");

  } catch (err) {
    console.error("❌ Seeding error:", err.message);
  } finally {
    process.exit();
  }
}

seed();
