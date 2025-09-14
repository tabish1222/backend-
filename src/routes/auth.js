import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pgPool } from "../db.js";

const router = express.Router();

// POST /auth/login  { email, password, type: 'parent'|'teacher' }
router.post("/login", async (req, res) => {
  const { email, password, type } = req.body;
  if (!email || !password || !type) return res.status(400).json({ error: "Missing fields" });
  try {
    const q = await pgPool.query("SELECT * FROM users WHERE email=$1 AND role=$2", [email, type]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    // build token claims depending on role
    if (type === "parent") {
      const map = await pgPool.query("SELECT student_id FROM parent_student WHERE parent_id=$1", [user.id]);
      const studentIds = map.rows.map(r => r.student_id);
      const token = jwt.sign({ role: "parent", parentId: user.id, studentIds }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, role: "parent" });
    } else {
      const cls = await pgPool.query("SELECT class_id FROM classes WHERE teacher_id=$1", [user.id]);
      const classIds = cls.rows.map(r => r.class_id);
      const token = jwt.sign({ role: "teacher", teacherId: user.id, classIds }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ token, role: "teacher" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
