const ANALYSIS_RULES = [
  {
    issue: "API URL Pasted Instead Of Logs",
    severity: "low",
    summary:
      "The input looks like an endpoint URL, so there is no real error text to diagnose.",
    suggestion:
      "Paste raw logs, stack traces, console output, or terminal errors instead of the API URL.",
    patterns: [
      /^https?:\/\/\S+\/api\/\S*$/i,
      /localhost:\d+\/api\/\S*/i,
      /127\.0\.0\.1:\d+\/api\/\S*/i
    ]
  },
  {
    issue: "Memory Exhaustion",
    severity: "high",
    summary: "The process ran out of available memory while executing.",
    suggestion:
      "Increase the memory limit and inspect the code for large allocations, leaks, or unbounded loops.",
    patterns: [
      /heap out of memory/i,
      /out of memory/i,
      /\boom\b/i,
      /oomkilled/i,
      /allocation failed/i
    ]
  },
  {
    issue: "Service Unreachable",
    severity: "high",
    summary:
      "The application could not connect to the target service because the connection was refused.",
    suggestion:
      "Make sure the target service is running, the host and port are correct, and firewall rules are not blocking access.",
    patterns: [/econnrefused/i, /connection refused/i, /failed to connect/i]
  },
  {
    issue: "DNS Or Host Resolution Failure",
    severity: "high",
    summary:
      "The application could not resolve the hostname for the dependency or API it was calling.",
    suggestion:
      "Verify the hostname, DNS configuration, and environment variables used for the service URL.",
    patterns: [
      /enotfound/i,
      /getaddrinfo/i,
      /name or service not known/i,
      /temporary failure in name resolution/i
    ]
  },
  {
    issue: "Request Timeout",
    severity: "medium",
    summary:
      "The request took too long and timed out before the operation completed.",
    suggestion:
      "Check network latency, dependency health, and timeout settings. If the operation is expected to be slow, increase the timeout carefully.",
    patterns: [/etimedout/i, /timed out/i, /timeout/i, /econnaborted/i]
  },
  {
    issue: "Port Conflict",
    severity: "medium",
    summary:
      "The application tried to bind to a port that is already in use.",
    suggestion:
      "Stop the other process using the port or change the configured port before restarting the app.",
    patterns: [/eaddrinuse/i, /address already in use/i, /port \d+.*in use/i]
  },
  {
    issue: "Missing File Or Module",
    severity: "high",
    summary:
      "The application is trying to load a dependency or file that is missing.",
    suggestion:
      "Check import paths, confirm dependencies are installed, and verify the file exists at the expected location.",
    patterns: [
      /cannot find module/i,
      /module not found/i,
      /\benoent\b/i,
      /no such file or directory/i
    ]
  },
  {
    issue: "Authentication Or Permission Failure",
    severity: "high",
    summary:
      "The request failed because of missing credentials or insufficient permissions.",
    suggestion:
      "Check API keys, tokens, role permissions, and access policies for the requested resource.",
    patterns: [
      /\b401\b/i,
      /\b403\b/i,
      /unauthorized/i,
      /forbidden/i,
      /permission denied/i,
      /\beacces\b/i
    ]
  },
  {
    issue: "Resource Or Route Not Found",
    severity: "medium",
    summary:
      "The application requested a route or resource that does not exist.",
    suggestion:
      "Verify the URL path, HTTP method, route registration, and whether the target resource actually exists.",
    patterns: [
      /cannot get /i,
      /cannot post /i,
      /request failed with status code 404/i,
      /route not found/i,
      /endpoint not found/i
    ]
  },
  {
    issue: "Build Or Syntax Error",
    severity: "high",
    summary:
      "The code failed to compile or contains invalid syntax that prevents execution.",
    suggestion:
      "Review the file and line mentioned in the error, then fix the syntax or build configuration problem before retrying.",
    patterns: [
      /syntaxerror/i,
      /unexpected token/i,
      /failed to compile/i,
      /compile error/i,
      /is not defined/i
    ]
  },
  {
    issue: "Database Connectivity Problem",
    severity: "high",
    summary:
      "The application is failing while communicating with the database.",
    suggestion:
      "Check the database connection string, credentials, network access, and whether the database server is reachable.",
    patterns: [
      /database error/i,
      /failed to connect to database/i,
      /sequelizeconnectionerror/i,
      /prisma/i,
      /mongoose/i,
      /postgres/i,
      /mysql/i
    ]
  },
  {
    issue: "Container Startup Failure",
    severity: "high",
    summary:
      "The container or Kubernetes workload is repeatedly failing to start.",
    suggestion:
      "Inspect the container logs, image reference, startup command, and readiness configuration for the failing workload.",
    patterns: [
      /crashloopbackoff/i,
      /imagepullbackoff/i,
      /errimagepull/i,
      /back-off restarting failed container/i
    ]
  },
  {
    issue: "Runtime Exception",
    severity: "medium",
    summary:
      "The application threw an exception while running.",
    suggestion:
      "Inspect the stack trace and fix the failing code path or bad input that triggered the exception.",
    patterns: [
      /typeerror/i,
      /referenceerror/i,
      /rangeerror/i,
      /unhandled promise rejection/i,
      /exception/i,
      /traceback/i
    ]
  },
  {
    issue: "General Application Error",
    severity: "medium",
    summary:
      "The logs contain an error signal, but there is not enough detail to classify it more precisely.",
    suggestion:
      "Paste a larger section of the logs, including the lines before and after the error, so the analyzer can provide a better diagnosis.",
    patterns: [/error:/i, /\berror\b/i, /failed/i]
  }
];

function getNonEmptyLines(logs) {
  return logs
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectEvidence(logs, patterns) {
  const lines = getNonEmptyLines(logs);
  const evidence = [];

  for (const line of lines) {
    if (patterns.some((pattern) => pattern.test(line))) {
      evidence.push(line);
    }

    if (evidence.length === 3) {
      break;
    }
  }

  return [...new Set(evidence)];
}

function collectFallbackEvidence(logs) {
  return getNonEmptyLines(logs).slice(0, 3);
}

function analyzeLogs(logs) {
  const cleanedLogs = typeof logs === "string" ? logs.trim() : "";

  if (!cleanedLogs) {
    return {
      issue: "No logs provided",
      severity: "low",
      summary: "The analyzer did not receive any log content.",
      suggestion: "Paste logs before analyzing.",
      evidence: []
    };
  }

  for (const rule of ANALYSIS_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(cleanedLogs))) {
      const evidence = collectEvidence(cleanedLogs, rule.patterns);

      return {
        issue: rule.issue,
        severity: rule.severity,
        summary: rule.summary,
        suggestion: rule.suggestion,
        evidence: evidence.length > 0 ? evidence : collectFallbackEvidence(cleanedLogs)
      };
    }
  }

  return {
    issue: "No Clear Failure Signature",
    severity: "low",
    summary:
      "The input does not match any of the common failure patterns currently supported by the analyzer.",
    suggestion:
      "Paste the exact error block or a longer section of logs around the failure so the analyzer has more context.",
    evidence: collectFallbackEvidence(cleanedLogs)
  };
}

module.exports = { analyzeLogs };
