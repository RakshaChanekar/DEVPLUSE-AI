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
const MAX_LOG_LENGTH = 50000;
const MAX_SERVICES = 25;
const MAX_SERVICE_TEXT_LENGTH = 80;
const ROUTE_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ROUTE_RATE_LIMIT_MAX_REQUESTS = 40;
const routeRateLimitStore = new Map();

function getLogsFromBody(body) {
  return typeof body?.logs === "string" ? body.logs : "";
}

function getServicesFromBody(body) {
  return Array.isArray(body?.services) ? body.services : [];
}

function trimText(value, maxLength = MAX_SERVICE_TEXT_LENGTH) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function normalizeLogs(logs) {
  return typeof logs === "string" ? logs.trim() : "";
}

function sanitizeServices(services) {
  return services.slice(0, MAX_SERVICES).map((service, index) => ({
    id: trimText(service?.id, 64) || `service-${index + 1}`,
    name: trimText(service?.name, 80) || `Service ${index + 1}`,
    tier: trimText(service?.tier, 32) || "custom",
    status:
      service?.status === "healthy" ||
      service?.status === "warning" ||
      service?.status === "critical"
        ? service.status
        : undefined,
    latencyMs: Number(service?.latencyMs),
    errorRatePct: Number(service?.errorRatePct),
    cpuPct: Number(service?.cpuPct),
    memoryPct: Number(service?.memoryPct),
    saturationPct: Number(service?.saturationPct),
    throughputRps: Number(service?.throughputRps),
    restarts: Number(service?.restarts)
  }));
}

function validatePayload(body, options = {}) {
  const { requireLogs = false } = options;
  const logs = getLogsFromBody(body);
  const services = getServicesFromBody(body);

  if (body?.logs !== undefined && typeof body.logs !== "string") {
    return {
      ok: false,
      status: 400,
      message: "The logs field must be a string."
    };
  }

  if (body?.services !== undefined && !Array.isArray(body.services)) {
    return {
      ok: false,
      status: 400,
      message: "The services field must be an array."
    };
  }

  if (services.length > MAX_SERVICES) {
    return {
      ok: false,
      status: 400,
      message: `A maximum of ${MAX_SERVICES} services may be submitted at once.`
    };
  }

  if (logs.length > MAX_LOG_LENGTH) {
    return {
      ok: false,
      status: 413,
      message: `Logs are too large. Submit at most ${MAX_LOG_LENGTH} characters per request.`
    };
  }

  const normalizedLogs = normalizeLogs(logs);

  if (requireLogs && !normalizedLogs) {
    return {
      ok: false,
      status: 400,
      message: "Paste logs before analyzing."
    };
  }

  return {
    ok: true,
    logs: normalizedLogs,
    services: sanitizeServices(services)
  };
}

function createRouteRateLimiter(limit, windowMs) {
  return (req, res, next) => {
    const clientKey = `${req.ip}:${req.path}`;
    const now = Date.now();
    const entry = routeRateLimitStore.get(clientKey);

    if (!entry || now >= entry.resetAt) {
      routeRateLimitStore.set(clientKey, {
        count: 1,
        resetAt: now + windowMs
      });
      return next();
    }

    if (entry.count >= limit) {
      res.setHeader("Retry-After", Math.ceil((entry.resetAt - now) / 1000));
      return res.status(429).json({
        error: "Too Many Requests",
        message: "Rate limit exceeded. Please wait a minute and try again."
      });
    }

    entry.count += 1;
    return next();
  };
}

function applyNoStore(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  next();
}

const heavyRouteRateLimiter = createRouteRateLimiter(
  ROUTE_RATE_LIMIT_MAX_REQUESTS,
  ROUTE_RATE_LIMIT_WINDOW_MS
);

router.use(applyNoStore);

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

router.post("/analyze", heavyRouteRateLimiter, async (req, res) => {
  const payload = validatePayload(req.body, { requireLogs: true });

  if (!payload.ok) {
    return res.status(payload.status).json({
      error: "Bad Request",
      message: payload.message
    });
  }

  const result = await analyzeLogs(payload.logs);
  res.json(result);
});

router.get("/monitoring/snapshot", (req, res) => {
  res.json(buildMonitoringSnapshot());
});

router.get("/monitoring/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-store, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.setHeader("X-Content-Type-Options", "nosniff");

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

router.post("/score", heavyRouteRateLimiter, async (req, res) => {
  const payload = validatePayload(req.body);

  if (!payload.ok) {
    return res.status(payload.status).json({
      error: "Bad Request",
      message: payload.message
    });
  }

  const analysis = payload.logs ? await analyzeLogs(payload.logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs: payload.logs,
    services: payload.services,
    analysis
  });

  res.json(snapshot.scorecard);
});

router.post("/predict", heavyRouteRateLimiter, async (req, res) => {
  const payload = validatePayload(req.body);

  if (!payload.ok) {
    return res.status(payload.status).json({
      error: "Bad Request",
      message: payload.message
    });
  }

  const analysis = payload.logs ? await analyzeLogs(payload.logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs: payload.logs,
    services: payload.services,
    analysis
  });

  res.json({
    timestamp: snapshot.timestamp,
    scorecard: snapshot.scorecard,
    predictions: snapshot.predictions
  });
});

router.post("/insights", heavyRouteRateLimiter, async (req, res) => {
  const payload = validatePayload(req.body);

  if (!payload.ok) {
    return res.status(payload.status).json({
      error: "Bad Request",
      message: payload.message
    });
  }

  const analysis = payload.logs ? await analyzeLogs(payload.logs) : null;
  const snapshot = buildMonitoringSnapshot({
    logs: payload.logs,
    services: payload.services,
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
