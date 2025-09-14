import express from "express";
import { authRequired } from "../middleware/auth.js";
import { pgPool, getMongo } from "../db.js";

const router = express.Router();

// GET /parent/children
router.get("/children", authRequired, async (req, res) => {
  if (req.user.role !== "parent") return res.status(403).json({ error: "Forbidden" });
  const studentIds = req.user.studentIds || [];
  if (studentIds.length === 0) return res.json([]);
  const q = await pgPool.query("SELECT id, name, grade FROM students WHERE id = ANY($1::int[])", [studentIds]);
  res.json(q.rows);
});

// GET /parent/dashboard/:studentId  -> attendance + feedback
router.get("/dashboard/:studentId", authRequired, async (req, res) => {
  if (req.user.role !== "parent") return res.status(403).json({ error: "Forbidden" });
  const sid = parseInt(req.params.studentId, 10);
  if (!(req.user.studentIds || []).includes(sid)) return res.status(403).json({ error: "Not your child" });

  const att = await pgPool.query("SELECT date, status FROM attendance WHERE student_id=$1 ORDER BY date DESC LIMIT 50", [sid]);
  const mongo = getMongo();
  const feedbacks = await mongo.collection("feedbacks").find({ studentId: sid }).sort({ date: -1 }).limit(50).toArray();

  res.json({ attendance: att.rows, feedbacks });
});

export default router;
