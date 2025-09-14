const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

// Parent adds student
router.post("/", authMiddleware, async (req, res) => {
  if (req.user.role !== "parent") return res.status(403).json({ error: "Only parents can add students" });

  try {
    const { name, grade } = req.body;
    const student = await Student.create({ name, grade, parentId: req.user.id });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my children (parent only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    let students;
    if (req.user.role === "parent") {
      students = await Student.findAll({ where: { parentId: req.user.id } });
    } else if (req.user.role === "teacher") {
      students = await Student.findAll({ include: { model: User, as: "parent" } });
    }
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
