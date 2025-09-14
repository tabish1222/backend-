const express = require("express");
const Student = require("../models/Student");
const auth = require("../middleware/auth");

const router = express.Router();

// Parent adds a child
router.post("/", auth("parent"), async (req, res) => {
  try {
    const { name, age } = req.body;
    const student = await Student.create({ name, age, parentId: req.user.id });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Parent views their children
router.get("/my", auth("parent"), async (req, res) => {
  try {
    const students = await Student.findAll({ where: { parentId: req.user.id } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Teacher views all students
router.get("/", auth("teacher"), async (req, res) => {
  try {
    const students = await Student.findAll();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
