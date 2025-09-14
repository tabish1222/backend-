import express from "express";
import { authRequired } from "../middleware/auth.js";
import { pgPool, getMongo } from "../db.js";

const router = express.Router();

// GET /teacher/students  -> students in teacher's classes
router.get("/students", authRequired, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  const classIds = req.user.classIds || [];
  const q = await pgPool.query(
    "SELECT s.id, s.name, s.grade, s.class_id FROM students s WHERE s.class_id = ANY($1::int[])", [classIds]
  );
  res.json(q.rows);
});

// GET consolidated dashboard for teacher
router.get("/dashboard/:studentId", authRequired, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  const sid = parseInt(req.params.studentId, 10);
  const chk = await pgPool.query("SELECT s.id FROM students s WHERE s.id=$1 AND s.class_id = ANY($2::int[])", [sid, req.user.classIds || []]);
  if (chk.rowCount === 0) return res.status(403).json({ error: "Not your student" });

  const att = await pgPool.query("SELECT date, status FROM attendance WHERE student_id=$1 ORDER BY date DESC LIMIT 50", [sid]);
  const mongo = getMongo();
  const feedbacks = await mongo.collection("feedbacks").find({ studentId: sid }).sort({ date: -1 }).limit(50).toArray();
  res.json({ attendance: att.rows, feedbacks });
});

// POST /teacher/attendance/:studentId  { status: 'present'|'absent'|'late' }
router.post("/attendance/:studentId", authRequired, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  const sid = parseInt(req.params.studentId, 10);
  const status = (req.body.status || "present").toLowerCase();
  if (!["present", "absent", "late"].includes(status)) return res.status(400).json({ error: "Invalid status" });

  const chk = await pgPool.query("SELECT s.id FROM students s WHERE s.id=$1 AND s.class_id = ANY($2::int[])", [sid, req.user.classIds || []]);
  if (chk.rowCount === 0) return res.status(403).json({ error: "Not your student" });

  await pgPool.query("INSERT INTO attendance (student_id, date, status) VALUES ($1, CURRENT_DATE, $2) ON CONFLICT DO NOTHING", [sid, status]);
  res.json({ ok: true });
});

// POST /teacher/feedback/:studentId { text }
router.post("/feedback/:studentId", authRequired, async (req, res) => {
  if (req.user.role !== "teacher") return res.status(403).json({ error: "Forbidden" });
  const sid = parseInt(req.params.studentId, 10);
  const text = req.body.text || "";
  if (!text) return res.status(400).json({ error: "Text required" });

  const chk = await pgPool.query("SELECT s.id FROM students s WHERE s.id=$1 AND s.class_id = ANY($2::int[])", [sid, req.user.classIds || []]);
  if (chk.rowCount === 0) return res.status(403).json({ error: "Not your student" });

  const mongo = getMongo();
  const feedback = { studentId: sid, teacherId: req.user.teacherId || req.user.teacherId, text, date: new Date() };
  await mongo.collection("feedbacks").insertOne(feedback);
  res.json({ ok: true, feedback });
});

export default router;
