const express = require("express");
const router = express.Router();
const {
  analyzeLogs,
  ANALYZER_VERSION,
  DEFAULT_GEMINI_MODEL,
  isGeminiConfigured
} = require("./ai");
const {
  buildMonitoringSnapshot,
  MONITORING_VERSION,
  STREAM_INTERVAL_MS
} = require("./monitoring");

function getLogsFromBody(body) {
  return typeof body?.logs === "string" ? body.logs : "";
}

function getServicesFromBody(body) {
  return Array.isArray(body?.services) ? body.services : [];
}

router.get("/status", (req, res) => {
  res.json({
    status: "Running",
    uptime: process.uptime(),
    analyzerVersion: ANALYZER_VERSION,
    provider: "Google AI Studio",
    providerConfigured: isGeminiConfigured(),
    defaultModel: DEFAULT_GEMINI_MODEL,
    environment: process.env.NODE_ENV || "development",
    monitoringVersion: MONITORING_VERSION,
    streamIntervalMs: STREAM_INTERVAL_MS,
    features: [
      "real_time_monitoring",
      "ai_scoring_system",
      "predictive_failure_detection"
    ]
  });
});

router.post("/analyze", async (req, res) => {
  const logs = getLogsFromBody(req.body);

  const result = await analyzeLogs(logs);

  if (!logs.trim()) {
    return res.status(400).json(result);
  }

  res.json(result);
});

router.get("/monitoring/snapshot", (req, res) => {
  res.json(buildMonitoringSnapshot());
});

router.get("/monitoring/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }

  let closed = false;

  function sendSnapshot() {
    if (closed) {
      return;
    }

    res.write(`data: ${JSON.stringify(buildMonitoringSnapshot())}\n\n`);
  }

  sendSnapshot();

  const streamInterval = setInterval(sendSnapshot, STREAM_INTERVAL_MS);
  const keepAliveInterval = setInterval(() => {
    if (!closed) {
      res.write(": keep-alive\n\n");
    }
  }, 15000);

  req.on("close", () => {
    closed = true;
    clearInterval(streamInterval);
    clearInterval(keepAliveInterval);
    res.end();
  });
});

router.post("/score", async (req, res) => {
  const logs = getLogsFromBody(req.body);
  const services = getServicesFromBody(req.body);
  const analysis = logs.trim() ? await analyzeLogs(logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs,
    services,
    analysis
  });

  res.json(snapshot.scorecard);
});

router.post("/predict", async (req, res) => {
  const logs = getLogsFromBody(req.body);
  const services = getServicesFromBody(req.body);
  const analysis = logs.trim() ? await analyzeLogs(logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs,
    services,
    analysis
  });

  res.json({
    timestamp: snapshot.timestamp,
    scorecard: snapshot.scorecard,
    predictions: snapshot.predictions
  });
});

router.post("/insights", async (req, res) => {
  const logs = getLogsFromBody(req.body);
  const services = getServicesFromBody(req.body);
  const analysis = logs.trim() ? await analyzeLogs(logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs,
    services,
    analysis
  });

  res.json({
    timestamp: snapshot.timestamp,
    analysis,
    monitoring: {
      summary: snapshot.summary,
      services: snapshot.services,
      events: snapshot.events
    },
    scorecard: snapshot.scorecard,
    predictions: snapshot.predictions
  });
});

module.exports = router;
