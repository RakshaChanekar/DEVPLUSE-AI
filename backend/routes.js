const express = require("express");
const router = express.Router();
const {
  analyzeLogs,
  ANALYZER_VERSION,
  DEFAULT_GEMINI_MODEL,
  isGeminiConfigured
} = require("./ai");

router.get("/status", (req, res) => {
  res.json({
    status: "Running",
    uptime: process.uptime(),
    analyzerVersion: ANALYZER_VERSION,
    provider: "Google AI Studio",
    providerConfigured: isGeminiConfigured(),
    defaultModel: DEFAULT_GEMINI_MODEL,
    environment: process.env.NODE_ENV || "development"
  });
});

router.post("/analyze", async (req, res) => {
  const logs = typeof req.body.logs === "string" ? req.body.logs : "";

  const result = await analyzeLogs(logs);

  if (!logs.trim()) {
    return res.status(400).json(result);
  }

  res.json(result);
});

module.exports = router;
