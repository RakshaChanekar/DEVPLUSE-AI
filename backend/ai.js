const ANALYZER_VERSION = "2026-04-23.4";
const DEFAULT_GEMINI_MODEL =
  process.env.GEMINI_MODEL || "gemini-2.5-flash";

const SEVERITY_RANK = {
  high: 3,
  medium: 2,
  low: 1
};

const URL_ONLY_INPUT_PATTERNS = [
  /^https?:\/\/\S+$/i,
  /^localhost:\d+\/api\/\S*$/i,
  /^127\.0\.0\.1:\d+\/api\/\S*$/i
];

const ANALYSIS_RULES = [
  {
    id: "memory-exhaustion",
    issue: "Memory Exhaustion",
    category: "runtime",
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
    id: "service-unreachable",
    issue: "Service Unreachable",
    category: "network",
    severity: "high",
    summary:
      "The application could not connect to the target service because the connection was refused.",
    suggestion:
      "Make sure the target service is running, the host and port are correct, and firewall rules are not blocking access.",
    patterns: [/econnrefused/i, /connection refused/i, /failed to connect/i]
  },
  {
    id: "network-transport-failure",
    issue: "Network Transport Failure",
    category: "network",
    severity: "medium",
    summary:
      "The request failed at the network layer before the application received a normal response.",
    suggestion:
      "Check network reachability, CORS settings, proxy configuration, and whether the upstream service is healthy.",
    patterns: [/axioserror:\s*network error/i, /\bnetwork error\b/i]
  },
  {
    id: "dns-host-resolution",
    issue: "DNS Or Host Resolution Failure",
    category: "network",
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
    id: "request-timeout",
    issue: "Request Timeout",
    category: "network",
    severity: "medium",
    summary:
      "A network request took too long and timed out before the operation completed.",
    suggestion:
      "Check dependency latency, timeout settings, and whether the service is overloaded or intermittently unavailable.",
    patterns: [
      /etimedout/i,
      /econnaborted/i,
      /request timeout/i,
      /request timed out/i
    ]
  },
  {
    id: "database-connectivity",
    issue: "Database Connectivity Problem",
    category: "database",
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
      /mongotimeouterror/i,
      /server selection timed out/i,
      /postgres/i,
      /mysql/i
    ]
  },
  {
    id: "input-validation",
    issue: "Input Validation Failure",
    category: "input",
    severity: "medium",
    summary:
      "The application rejected the request because the provided input was empty, invalid, or incomplete.",
    suggestion:
      "Validate required fields before sending the request and return clearer field-level validation messages where possible.",
    patterns: [
      /valueerror/i,
      /validationerror/i,
      /input text is empty/i,
      /invalid input/i,
      /bad request/i,
      /required field/i
    ]
  },
  {
    id: "port-conflict",
    issue: "Port Conflict",
    category: "runtime",
    severity: "medium",
    summary:
      "The application tried to bind to a port that is already in use.",
    suggestion:
      "Stop the other process using the port or change the configured port before restarting the app.",
    patterns: [/eaddrinuse/i, /address already in use/i, /port \d+.*in use/i]
  },
  {
    id: "missing-file-or-module",
    issue: "Missing File Or Module",
    category: "filesystem",
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
    id: "authentication-or-permission",
    issue: "Authentication Or Permission Failure",
    category: "security",
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
    id: "resource-or-route-not-found",
    issue: "Resource Or Route Not Found",
    category: "api",
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
    id: "build-or-syntax",
    issue: "Build Or Syntax Error",
    category: "build",
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
    id: "container-startup",
    issue: "Container Startup Failure",
    category: "deploy",
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
    id: "runtime-exception",
    issue: "Runtime Exception",
    category: "runtime",
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
    id: "general-application-error",
    issue: "General Application Error",
    category: "application",
    severity: "medium",
    summary:
      "The logs contain an error signal, but there is not enough detail to classify it more precisely.",
    suggestion:
      "Paste a larger section of the logs, including the lines before and after the error, so the analyzer can provide a better diagnosis.",
    patterns: [/error:/i, /\berror\b/i, /failed/i],
    catchAll: true
  }
];

const GEMINI_ANALYSIS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "issueCount",
    "categories",
    "issue",
    "severity",
    "summary",
    "suggestion",
    "evidence",
    "issues"
  ],
  properties: {
    issueCount: {
      type: "integer",
      minimum: 0
    },
    categories: {
      type: "array",
      items: {
        type: "string"
      }
    },
    issue: {
      type: "string"
    },
    severity: {
      type: "string",
      enum: ["high", "medium", "low"]
    },
    summary: {
      type: "string"
    },
    suggestion: {
      type: "string"
    },
    evidence: {
      type: "array",
      items: {
        type: "string"
      }
    },
    issues: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "issue",
          "category",
          "severity",
          "summary",
          "suggestion",
          "evidence"
        ],
        properties: {
          id: {
            type: "string"
          },
          issue: {
            type: "string"
          },
          category: {
            type: "string"
          },
          severity: {
            type: "string",
            enum: ["high", "medium", "low"]
          },
          summary: {
            type: "string"
          },
          suggestion: {
            type: "string"
          },
          evidence: {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      }
    }
  }
};

const GEMINI_SYSTEM_INSTRUCTION = `
You analyze application logs and stack traces.

Return only issues that are directly supported by the provided text.
If the same problem appears multiple times, merge it into one issue.
If multiple different problems appear, return them separately.
Use short, specific summaries and practical suggestions.
Evidence entries must be exact lines copied from the logs.
Do not invent missing services, files, stack frames, or configuration values.
Choose severity conservatively:
- high: the app is crashing, cannot reach core dependencies, or is fundamentally broken
- medium: a significant error or validation failure that blocks a workflow
- low: weak or unclear failure signal
Set the top-level issue to the highest-priority issue.
Set issueCount to the number of entries in issues.
Set categories to the distinct categories represented in issues.
If there is no clear issue, return issueCount 0 and leave issues as an empty array.
`.trim();

let geminiClientPromise;

function getGeminiApiKey() {
  const apiKey = (process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return "";
  }

  return apiKey;
}

function isGeminiConfigured() {
  return Boolean(getGeminiApiKey());
}

function getNonEmptyLines(logs) {
  return logs
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function getUniqueLines(lines, limit = 3) {
  return [...new Set(lines)].slice(0, limit);
}

function collectEvidence(lines, patterns) {
  return getUniqueLines(
    lines.filter((line) => patterns.some((pattern) => pattern.test(line)))
  );
}

function getSeverityRank(severity) {
  return SEVERITY_RANK[severity] || 0;
}

function sortIssues(issues) {
  return [...issues].sort((left, right) => {
    const severityDifference =
      getSeverityRank(right.severity) - getSeverityRank(left.severity);

    if (severityDifference !== 0) {
      return severityDifference;
    }

    const evidenceDifference =
      (right.evidence?.length || 0) - (left.evidence?.length || 0);

    if (evidenceDifference !== 0) {
      return evidenceDifference;
    }

    return left.issue.localeCompare(right.issue);
  });
}

function isUrlOnlyInput(logs) {
  return URL_ONLY_INPUT_PATTERNS.some((pattern) => pattern.test(logs));
}

function sanitizeEvidence(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return getUniqueLines(
    value.filter((entry) => typeof entry === "string").map((entry) => entry.trim()),
    3
  );
}

function sanitizeIssues(issues) {
  if (!Array.isArray(issues)) {
    return [];
  }

  return sortIssues(
    issues
      .filter((issue) => issue && typeof issue === "object")
      .map((issue, index) => ({
        id:
          typeof issue.id === "string" && issue.id.trim()
            ? issue.id.trim()
            : `issue-${index + 1}`,
        issue:
          typeof issue.issue === "string" && issue.issue.trim()
            ? issue.issue.trim()
            : "Unspecified Issue",
        category:
          typeof issue.category === "string" && issue.category.trim()
            ? issue.category.trim()
            : "application",
        severity:
          issue.severity === "high" ||
          issue.severity === "medium" ||
          issue.severity === "low"
            ? issue.severity
            : "medium",
        summary:
          typeof issue.summary === "string" && issue.summary.trim()
            ? issue.summary.trim()
            : "No summary provided.",
        suggestion:
          typeof issue.suggestion === "string" && issue.suggestion.trim()
            ? issue.suggestion.trim()
            : "Inspect the surrounding logs and fix the failing component.",
        evidence: sanitizeEvidence(issue.evidence)
      }))
  );
}

function createIssue(rule, evidence) {
  return {
    id: rule.id,
    issue: rule.issue,
    category: rule.category,
    severity: rule.severity,
    summary: rule.summary,
    suggestion: rule.suggestion,
    evidence
  };
}

function buildResponse(issues, fallback, metadata = {}) {
  const baseMetadata = {
    analyzerVersion: ANALYZER_VERSION,
    engine: metadata.engine || "rules",
    model: metadata.model || null,
    fallbackReason: metadata.fallbackReason || null
  };

  if (issues.length === 0) {
    return {
      ...baseMetadata,
      issueCount: 0,
      categories: fallback.categories || [],
      issue: fallback.issue,
      severity: fallback.severity,
      summary: fallback.summary,
      suggestion: fallback.suggestion,
      evidence: fallback.evidence,
      issues: []
    };
  }

  const sortedIssues = sortIssues(issues);
  const primaryIssue = sortedIssues[0];
  const categories = [...new Set(sortedIssues.map((issue) => issue.category))];
  const overallSummary =
    sortedIssues.length === 1
      ? primaryIssue.summary
      : `Detected ${sortedIssues.length} separate issues in the provided logs. The highest-priority issue is "${primaryIssue.issue}".`;
  const overallSuggestion =
    sortedIssues.length === 1
      ? primaryIssue.suggestion
      : "Review each detected issue below. Resolve the highest-severity finding first, then work through the remaining issues.";

  return {
    ...baseMetadata,
    issueCount: sortedIssues.length,
    categories,
    issue: primaryIssue.issue,
    severity: primaryIssue.severity,
    summary: overallSummary,
    suggestion: overallSuggestion,
    evidence: primaryIssue.evidence,
    issues: sortedIssues
  };
}

function analyzeLogsWithRules(logs, metadata = {}) {
  const cleanedLogs = typeof logs === "string" ? logs.trim() : "";

  if (!cleanedLogs) {
    return buildResponse(
      [],
      {
        issue: "No logs provided",
        severity: "low",
        summary: "The analyzer did not receive any log content.",
        suggestion: "Paste logs before analyzing.",
        evidence: [],
        categories: []
      },
      metadata
    );
  }

  if (isUrlOnlyInput(cleanedLogs)) {
    return buildResponse(
      [
        {
          id: "api-url-pasted-instead-of-logs",
          issue: "API URL Pasted Instead Of Logs",
          category: "input",
          severity: "low",
          summary:
            "The input looks like an endpoint URL, so there is no real error text to diagnose.",
          suggestion:
            "Paste raw logs, stack traces, console output, or terminal errors instead of the API URL.",
          evidence: [cleanedLogs]
        }
      ],
      null,
      metadata
    );
  }

  const lines = getNonEmptyLines(cleanedLogs);
  const matchedIssues = [];

  for (const rule of ANALYSIS_RULES) {
    if (rule.catchAll) {
      continue;
    }

    const evidence = collectEvidence(lines, rule.patterns);

    if (evidence.length > 0) {
      matchedIssues.push(createIssue(rule, evidence));
    }
  }

  if (matchedIssues.length === 0) {
    const catchAllRule = ANALYSIS_RULES.find((rule) => rule.catchAll);
    const catchAllEvidence = collectEvidence(lines, catchAllRule.patterns);

    if (catchAllEvidence.length > 0) {
      matchedIssues.push(createIssue(catchAllRule, catchAllEvidence));
    }
  }

  if (matchedIssues.length === 0) {
    return buildResponse(
      [],
      {
        issue: "No Clear Failure Signature",
        severity: "low",
        summary:
          "The input does not match any of the common failure patterns currently supported by the analyzer.",
        suggestion:
          "Paste the exact error block or a longer section of logs around the failure so the analyzer has more context.",
        evidence: getUniqueLines(lines),
        categories: []
      },
      metadata
    );
  }

  return buildResponse(matchedIssues, null, metadata);
}

async function getGeminiClient() {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    return null;
  }

  if (!geminiClientPromise) {
    geminiClientPromise = import("@google/genai").then(({ GoogleGenAI }) => {
      return new GoogleGenAI({
        apiKey
      });
    });
  }

  return geminiClientPromise;
}

function safeJsonParse(value) {
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function normalizeGeminiResponse(parsed, model) {
  const issues = sanitizeIssues(parsed?.issues);
  const primaryIssue = issues[0];
  const categories = [...new Set(issues.map((issue) => issue.category))];

  if (issues.length === 0) {
    return buildResponse(
      [],
      {
        issue:
          typeof parsed?.issue === "string" && parsed.issue.trim()
            ? parsed.issue.trim()
            : "No Clear Failure Signature",
        severity:
          parsed?.severity === "high" ||
          parsed?.severity === "medium" ||
          parsed?.severity === "low"
            ? parsed.severity
            : "low",
        summary:
          typeof parsed?.summary === "string" && parsed.summary.trim()
            ? parsed.summary.trim()
            : "The AI analyzer did not find a clear failure signature in the provided logs.",
        suggestion:
          typeof parsed?.suggestion === "string" && parsed.suggestion.trim()
            ? parsed.suggestion.trim()
            : "Paste a larger section of logs around the failure so the analyzer has more context.",
        evidence: sanitizeEvidence(parsed?.evidence),
        categories:
          Array.isArray(parsed?.categories) &&
          parsed.categories.every((category) => typeof category === "string")
            ? parsed.categories
            : []
      },
      {
        engine: "google_ai_studio",
        model
      }
    );
  }

  return {
    analyzerVersion: ANALYZER_VERSION,
    engine: "google_ai_studio",
    model,
    fallbackReason: null,
    issueCount: issues.length,
    categories,
    issue:
      typeof parsed?.issue === "string" && parsed.issue.trim()
        ? parsed.issue.trim()
        : primaryIssue.issue,
    severity:
      parsed?.severity === "high" ||
      parsed?.severity === "medium" ||
      parsed?.severity === "low"
        ? parsed.severity
        : primaryIssue.severity,
    summary:
      typeof parsed?.summary === "string" && parsed.summary.trim()
        ? parsed.summary.trim()
        : `Detected ${issues.length} separate issues in the provided logs. The highest-priority issue is "${primaryIssue.issue}".`,
    suggestion:
      typeof parsed?.suggestion === "string" && parsed.suggestion.trim()
        ? parsed.suggestion.trim()
        : "Review each detected issue below. Resolve the highest-severity finding first, then work through the remaining issues.",
    evidence:
      sanitizeEvidence(parsed?.evidence).length > 0
        ? sanitizeEvidence(parsed.evidence)
        : primaryIssue.evidence,
    issues
  };
}

async function analyzeLogs(logs) {
  const cleanedLogs = typeof logs === "string" ? logs.trim() : "";

  if (!cleanedLogs || isUrlOnlyInput(cleanedLogs)) {
    return analyzeLogsWithRules(cleanedLogs, {
      engine: "rules",
      model: null
    });
  }

  const client = await getGeminiClient();

  if (!client) {
    return analyzeLogsWithRules(cleanedLogs, {
      engine: "rule_fallback",
      model: null,
      fallbackReason: "GEMINI_API_KEY is not set on the backend."
    });
  }

  try {
    const response = await client.models.generateContent({
      model: DEFAULT_GEMINI_MODEL,
      contents: `Analyze these logs and detect multiple issues separately when needed:\n\n${cleanedLogs}`,
      config: {
        systemInstruction: GEMINI_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: GEMINI_ANALYSIS_SCHEMA,
        temperature: 0.1
      }
    });

    const parsed = safeJsonParse(response.text);

    if (!parsed) {
      return analyzeLogsWithRules(cleanedLogs, {
        engine: "rule_fallback",
        model: DEFAULT_GEMINI_MODEL,
        fallbackReason:
          "The Google AI Studio response did not contain parseable structured JSON."
      });
    }

    return normalizeGeminiResponse(parsed, DEFAULT_GEMINI_MODEL);
  } catch (error) {
    return analyzeLogsWithRules(cleanedLogs, {
      engine: "rule_fallback",
      model: DEFAULT_GEMINI_MODEL,
      fallbackReason:
        error?.message ||
        "The Google AI Studio request failed, so the rule fallback was used."
    });
  }
}

module.exports = {
  analyzeLogs,
  analyzeLogsWithRules,
  ANALYZER_VERSION,
  DEFAULT_GEMINI_MODEL,
  isGeminiConfigured
};
