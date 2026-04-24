const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, ".env")
});
require("dotenv").config();

const express = require("express");
const cors = require("cors");

const routes = require("./routes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CORS_ORIGIN = (process.env.CORS_ORIGIN || "").trim();
const JSON_LIMIT = process.env.JSON_LIMIT || "1mb";
const NODE_ENV = process.env.NODE_ENV || "development";
const LOCAL_DEV_ORIGINS = [
  "http://localhost",
  "http://127.0.0.1",
  "http://[::1]",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://[::1]:3000"
];

function parseOriginList(value) {
  return value
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function buildAllowedOrigins() {
  const configuredOrigins =
    CORS_ORIGIN === "*"
      ? NODE_ENV === "development"
        ? LOCAL_DEV_ORIGINS
        : []
      : CORS_ORIGIN
        ? parseOriginList(CORS_ORIGIN)
        : NODE_ENV === "development"
          ? LOCAL_DEV_ORIGINS
          : [];
  const allowedOrigins = new Set(configuredOrigins);

  for (const origin of configuredOrigins) {
    try {
      const url = new URL(origin);

      if (url.hostname === "localhost") {
        allowedOrigins.add(origin.replace("localhost", "127.0.0.1"));
      }

      if (url.hostname === "127.0.0.1") {
        allowedOrigins.add(origin.replace("127.0.0.1", "localhost"));
      }
    } catch (error) {
      // Ignore invalid entries and let the explicit allowlist handle them.
    }
  }

  return allowedOrigins;
}

function isDevelopmentOriginAllowed(origin) {
  if (typeof origin !== "string") {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    const hostname = parsedOrigin.hostname.toLowerCase();
    const normalizedHostname =
      hostname.startsWith("[") && hostname.endsWith("]")
        ? hostname.slice(1, -1)
        : hostname;

    return (
      parsedOrigin.protocol === "http:" ||
      parsedOrigin.protocol === "https:"
    ) && (
      normalizedHostname === "localhost" ||
      normalizedHostname === "127.0.0.1" ||
      normalizedHostname === "::1" ||
      normalizedHostname.endsWith(".localhost") ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(normalizedHostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(normalizedHostname) ||
      /^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(normalizedHostname)
    );
  } catch (error) {
    return false;
  }
}

function buildCorsOptions() {
  if (NODE_ENV === "development") {
    return {
      origin: true,
      methods: ["GET", "POST", "OPTIONS"],
      optionsSuccessStatus: 204
    };
  }

  const allowedOrigins = buildAllowedOrigins();

  return {
    methods: ["GET", "POST", "OPTIONS"],
    optionsSuccessStatus: 204,
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      if (isDevelopmentOriginAllowed(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  };
}

function setSecurityHeaders(req, res, next) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), browsing-topics=()"
  );
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");

  const forwardedProto = req.headers["x-forwarded-proto"];
  const isHttps =
    req.secure ||
    (typeof forwardedProto === "string" &&
      forwardedProto.toLowerCase().includes("https"));

  if (isHttps) {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
  }

  next();
}

app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(setSecurityHeaders);
app.use(cors(buildCorsOptions()));
app.use(
  express.json({
    limit: JSON_LIMIT,
    strict: true,
    type: "application/json"
  })
);

app.get("/", (req, res) => {
  res.json({
    name: "DevPulse AI",
    status: "ok",
    apiBasePath: "/api"
  });
});

app.use("/api", routes);

app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: "The requested resource does not exist."
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      error: "Bad Request",
      message: "The request body must contain valid JSON."
    });
  }

  if (err?.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      error: "Forbidden",
      message: "This origin is not allowed to access the API."
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong while processing the request."
  });
});

const server = app.listen(PORT, () => {
  console.log(`DevPulse backend running on port ${PORT}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down DevPulse backend...`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

module.exports = app;
