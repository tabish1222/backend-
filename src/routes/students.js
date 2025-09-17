// src/routes/students.js
import express from "express";
import { Student } from "../models/Student.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();

/**
 * GET /students
 * - Teachers: see all students
 * - Parents: see only their own children
 */
router.get("/", authenticateJWT, async (req, res) => {
  try {
    let students;

    if (req.user.role === "teacher") {
      students = await Student.findAll();
    } else if (req.user.role === "parent") {
      students = await Student.findAll({
        where: { parent_id: req.user.id },
      });
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

/**
 * POST /students
 * - Only teachers can create students
 * - Optionally assign a parent_id when creating
 */
router.post("/", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can add students" });
    }

    const { name, class: className, age, parent_id } = req.body;

    if (!name || !className || !age) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const student = await Student.create({
      name,
      class: className,
      age,
      parent_id: parent_id || null,
    });

    res.status(201).json(student);
  } catch (err) {
    console.error("Error creating student:", err);
    res.status(500).json({ error: "Failed to create student" });
  }
});

/**
 * PUT /students/:id
 * - Teachers: can update any student
 * - Parents: can only update their own children
 */
router.put("/:id", authenticateJWT, async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    if (
      req.user.role === "parent" &&
      student.parent_id !== req.user.id
    ) {
      return res.status(403).json({ error: "You can only update your own child" });
    }

    if (
      req.user.role === "teacher" ||
      (req.user.role === "parent" && student.parent_id === req.user.id)
    ) {
      await student.update(req.body);
      return res.json(student);
    }

    res.status(403).json({ error: "Forbidden" });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ error: "Failed to update student" });
  }
});

/**
 * DELETE /students/:id
 * - Teachers only
 */
router.delete("/:id", authenticateJWT, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ error: "Only teachers can delete students" });
    }

    const student = await Student.findByPk(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ error: "Failed to delete student" });
  }
});

export default router;
