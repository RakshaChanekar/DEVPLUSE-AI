const express = require("express");
const router = express.Router();
const { analyzeLogs } = require("./ai");

router.get("/status", (req, res) => {
  res.json({ status: "Running", uptime: process.uptime() });
});

router.post("/analyze", (req, res) => {
  const logs = req.body.logs;

  if (!logs) {
    return res.status(400).json({
      issue: "No logs provided",
      suggestion: "Paste logs before analyzing"
    });
  }

  const result = analyzeLogs(logs);
  res.json(result);
});

module.exports = router;