const express = require("express");
const Student = require("../models/Student");
const User = require("../models/User");
const auth = require("../middleware/auth");

const router = express.Router();

// Add student (only parents or teachers)
router.post("/", auth, async (req, res) => {
  try {
    const { name, age, grade } = req.body;
    const student = new Student({
      name,
      age,
      grade,
      parent: req.user.id
    });

    await student.save();

    // link student to parent
    await User.findByIdAndUpdate(req.user.id, {
      $push: { children: student._id }
    });

    res.json(student);
  } catch (err) {
    console.error("Add student error:", err);
    res.status(500).json({ error: "Error adding student" });
  }
});

// Get all students of logged-in parent/teacher
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("children");
    res.json(user.children || []);
  } catch (err) {
    console.error("Get students error:", err);
    res.status(500).json({ error: "Error fetching students" });
  }
});

module.exports = router;
