require("dotenv").config();

const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = Number(process.env.PORT || 5000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";
const JSON_LIMIT = process.env.JSON_LIMIT || "1mb";

function buildCorsOptions() {
  if (CORS_ORIGIN === "*") {
    return { origin: true };
  }

  const allowedOrigins = CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    }
  };
}

app.disable("x-powered-by");
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: JSON_LIMIT }));

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
