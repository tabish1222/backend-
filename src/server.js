import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import parentRoutes from "./routes/parent.js";
import teacherRoutes from "./routes/teacher.js";
import { pgPool, connectMongo } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true, service: "school-backend" }));

app.use("/auth", authRoutes);
app.use("/parent", parentRoutes);
app.use("/teacher", teacherRoutes);

const PORT = process.env.PORT || 10000;
async function start() {
  try {
    // test connections
    await pgPool.query("SELECT 1");
    await connectMongo();
    app.listen(PORT, () => console.log("Backend running on port", PORT));
  } catch (err) {
    console.error("Startup error", err.message);
    process.exit(1);
  }
}
start();
