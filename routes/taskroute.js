const express = require("express");
const Task = require("../models/Tasks");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

// Create Task
router.post("/ptasks", auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const task = new Task({ title, description, user: req.user.id });
    await task.save();
    return res.status(201).json(task);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});

// Get All Tasks for Logged-in User
router.get("/gtasks", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    return res.json(tasks);
  } catch (err) {
    return res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});

// Delete Task
router.delete("/dtasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ msg: "Task Not Found!" });
    }
    return res.json({ msg: "Task Deleted Successfully!" });
  } catch (err) {
    return res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});
 //status update
router.put("/utasks/:id", auth, async (req, res) => {
  try {
    const { completed } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed },
      { new: true }
    );
    if (!task) return res.status(404).json({ msg: "Task not found!" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});

// Toggle Task completed status
router.put("/toggle/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: "Task not found" });

    task.completed = !task.completed;
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(500).json({ msg: "Server Error!", error: err.message });
  }
});


module.exports = router;
