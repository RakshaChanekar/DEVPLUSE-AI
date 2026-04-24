const { analyzeLogsWithRules } = require("./ai");

const MONITORING_VERSION = "2026-04-23.1";
const STREAM_INTERVAL_MS = getBoundedInteger(
  process.env.MONITORING_STREAM_INTERVAL_MS,
  5000,
  1000,
  30000
);

const SERVICE_BLUEPRINTS = [
  {
    id: "api-gateway",
    name: "API Gateway",
    tier: "edge",
    baseLatencyMs: 118,
    baseErrorRatePct: 0.5,
    baseCpuPct: 42,
    baseMemoryPct: 49,
    baseSaturationPct: 56,
    baseThroughputRps: 320,
    phaseOffset: 0.4
  },
  {
    id: "auth-service",
    name: "Auth Service",
    tier: "core",
    baseLatencyMs: 94,
    baseErrorRatePct: 0.3,
    baseCpuPct: 38,
    baseMemoryPct: 46,
    baseSaturationPct: 44,
    baseThroughputRps: 210,
    phaseOffset: 1.2
  },
  {
    id: "worker-cluster",
    name: "Worker Cluster",
    tier: "compute",
    baseLatencyMs: 168,
    baseErrorRatePct: 0.8,
    baseCpuPct: 57,
    baseMemoryPct: 63,
    baseSaturationPct: 65,
    baseThroughputRps: 146,
    phaseOffset: 2.1
  },
  {
    id: "postgres",
    name: "Postgres",
    tier: "data",
    baseLatencyMs: 72,
    baseErrorRatePct: 0.2,
    baseCpuPct: 34,
    baseMemoryPct: 58,
    baseSaturationPct: 38,
    baseThroughputRps: 480,
    phaseOffset: 2.8
  },
  {
    id: "cache",
    name: "Redis Cache",
    tier: "data",
    baseLatencyMs: 24,
    baseErrorRatePct: 0.1,
    baseCpuPct: 28,
    baseMemoryPct: 41,
    baseSaturationPct: 34,
    baseThroughputRps: 710,
    phaseOffset: 3.6
  }
];

const SCORE_LABELS = [
  { minimum: 90, label: "Strong", riskLevel: "low" },
  { minimum: 75, label: "Stable", riskLevel: "guarded" },
  { minimum: 55, label: "Watchlist", riskLevel: "medium" },
  { minimum: 0, label: "Critical", riskLevel: "high" }
];

function getBoundedInteger(value, defaultValue, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  return Math.min(Math.max(parsed, minimum), maximum);
}

function clampNumber(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundTo(value, precision = 1) {
  const multiplier = 10 ** precision;
  return Math.round(value * multiplier) / multiplier;
}

function normalizeRange(value, minimum, maximum) {
  if (maximum <= minimum) {
    return 0;
  }

  return clampNumber((value - minimum) / (maximum - minimum), 0, 1);
}

function buildWave(timestamp, phaseOffset, speed, amplitude) {
  return Math.sin(timestamp / speed + phaseOffset) * amplitude;
}

function inferServiceStatus(service) {
  if (
    service.errorRatePct >= 3.2 ||
    service.latencyMs >= 350 ||
    service.cpuPct >= 92 ||
    service.memoryPct >= 94 ||
    service.restarts >= 2
  ) {
    return "critical";
  }

  if (
    service.errorRatePct >= 1.2 ||
    service.latencyMs >= 220 ||
    service.cpuPct >= 78 ||
    service.memoryPct >= 82 ||
    service.saturationPct >= 80 ||
    service.restarts >= 1
  ) {
    return "warning";
  }

  return "healthy";
}

function buildSyntheticService(blueprint, timestamp) {
  const trafficWave = buildWave(timestamp, blueprint.phaseOffset, 95000, 12);
  const pressureWave = Math.max(
    0,
    buildWave(timestamp, blueprint.phaseOffset * 1.6, 210000, 1)
  );
  const spikeWave = Math.max(
    0,
    buildWave(timestamp, blueprint.phaseOffset * 2.2, 430000, 1)
  );

  const cpuPct = clampNumber(
    blueprint.baseCpuPct + trafficWave + pressureWave * 23 + spikeWave * 10,
    12,
    98
  );
  const memoryPct = clampNumber(
    blueprint.baseMemoryPct +
      buildWave(timestamp, blueprint.phaseOffset, 155000, 8) +
      pressureWave * 20,
    20,
    97
  );
  const saturationPct = clampNumber(
    blueprint.baseSaturationPct +
      buildWave(timestamp, blueprint.phaseOffset, 105000, 10) +
      pressureWave * 18,
    15,
    99
  );
  const latencyMs = clampNumber(
    blueprint.baseLatencyMs +
      pressureWave * 185 +
      buildWave(timestamp, blueprint.phaseOffset, 120000, 26),
    14,
    850
  );
  const errorRatePct = clampNumber(
    blueprint.baseErrorRatePct +
      pressureWave * 2.9 +
      Math.max(0, buildWave(timestamp, blueprint.phaseOffset, 118000, 0.8)),
    0,
    14
  );
  const throughputRps = clampNumber(
    blueprint.baseThroughputRps +
      buildWave(timestamp, blueprint.phaseOffset, 87000, 52) +
      pressureWave * 68,
    10,
    1500
  );
  const restarts =
    errorRatePct >= 4.6 || memoryPct >= 96
      ? 2
      : errorRatePct >= 2.8 || cpuPct >= 92
        ? 1
        : 0;

  const service = {
    id: blueprint.id,
    name: blueprint.name,
    tier: blueprint.tier,
    latencyMs: roundTo(latencyMs),
    errorRatePct: roundTo(errorRatePct, 2),
    cpuPct: roundTo(cpuPct),
    memoryPct: roundTo(memoryPct),
    saturationPct: roundTo(saturationPct),
    throughputRps: roundTo(throughputRps),
    restarts
  };

  return {
    ...service,
    status: inferServiceStatus(service)
  };
}

function normalizeServicesInput(services) {
  if (!Array.isArray(services) || services.length === 0) {
    return [];
  }

  return services
    .filter((service) => service && typeof service === "object")
    .map((service, index) => {
      const normalized = {
        id:
          typeof service.id === "string" && service.id.trim()
            ? service.id.trim()
            : `service-${index + 1}`,
        name:
          typeof service.name === "string" && service.name.trim()
            ? service.name.trim()
            : `Service ${index + 1}`,
        tier:
          typeof service.tier === "string" && service.tier.trim()
            ? service.tier.trim()
            : "custom",
        latencyMs: roundTo(clampNumber(Number(service.latencyMs) || 0, 0, 5000)),
        errorRatePct: roundTo(
          clampNumber(Number(service.errorRatePct) || 0, 0, 100),
          2
        ),
        cpuPct: roundTo(clampNumber(Number(service.cpuPct) || 0, 0, 100)),
        memoryPct: roundTo(clampNumber(Number(service.memoryPct) || 0, 0, 100)),
        saturationPct: roundTo(
          clampNumber(Number(service.saturationPct) || 0, 0, 100)
        ),
        throughputRps: roundTo(
          clampNumber(Number(service.throughputRps) || 0, 0, 100000)
        ),
        restarts: clampNumber(Number(service.restarts) || 0, 0, 100)
      };

      return {
        ...normalized,
        status:
          service.status === "healthy" ||
          service.status === "warning" ||
          service.status === "critical"
            ? service.status
            : inferServiceStatus(normalized)
      };
    });
}

function getSyntheticServices(timestamp) {
  return SERVICE_BLUEPRINTS.map((blueprint) =>
    buildSyntheticService(blueprint, timestamp)
  );
}

function collectAnalysisSignals(analysis) {
  if (!analysis || !Array.isArray(analysis.issues)) {
    return {
      issuePenalty: 0,
      issueCount: 0,
      highSeverityIssues: 0,
      categories: []
    };
  }

  const issuePenalty = analysis.issues.reduce((total, issue) => {
    if (issue.severity === "high") {
      return total + 16;
    }

    if (issue.severity === "medium") {
      return total + 8;
    }

    return total + 3;
  }, 0);

  return {
    issuePenalty,
    issueCount: analysis.issues.length,
    highSeverityIssues: analysis.issues.filter(
      (issue) => issue.severity === "high"
    ).length,
    categories: [...new Set(analysis.issues.map((issue) => issue.category))]
  };
}

function buildScorecard({ services, analysis }) {
  const serviceCount = services.length || 1;
  const warningCount = services.filter(
    (service) => service.status === "warning"
  ).length;
  const criticalCount = services.filter(
    (service) => service.status === "critical"
  ).length;
  const averageLatencyMs =
    services.reduce((total, service) => total + service.latencyMs, 0) /
    serviceCount;
  const averageErrorRatePct =
    services.reduce((total, service) => total + service.errorRatePct, 0) /
    serviceCount;
  const averageCpuPct =
    services.reduce((total, service) => total + service.cpuPct, 0) / serviceCount;
  const averageSaturationPct =
    services.reduce((total, service) => total + service.saturationPct, 0) /
    serviceCount;
  const restartCount = services.reduce(
    (total, service) => total + service.restarts,
    0
  );
  const analysisSignals = collectAnalysisSignals(analysis);

  const availabilityScore = clampNumber(
    100 -
      averageErrorRatePct * 16 -
      warningCount * 5 -
      criticalCount * 16 -
      restartCount * 5,
    0,
    100
  );
  const performanceScore = clampNumber(
    100 -
      normalizeRange(averageLatencyMs, 80, 420) * 52 -
      normalizeRange(averageCpuPct, 35, 92) * 24 -
      normalizeRange(averageSaturationPct, 40, 92) * 24,
    0,
    100
  );
  const reliabilityScore = clampNumber(
    100 -
      analysisSignals.issuePenalty -
      warningCount * 4 -
      criticalCount * 12,
    0,
    100
  );
  const resilienceScore = clampNumber(
    100 -
      services.filter((service) => service.memoryPct >= 85).length * 14 -
      services.filter((service) => service.cpuPct >= 90).length * 12 -
      analysisSignals.highSeverityIssues * 10,
    0,
    100
  );
  const overallScore = roundTo(
    availabilityScore * 0.34 +
      performanceScore * 0.24 +
      reliabilityScore * 0.26 +
      resilienceScore * 0.16,
    1
  );
  const scoreLabel =
    SCORE_LABELS.find((entry) => overallScore >= entry.minimum) ||
    SCORE_LABELS[SCORE_LABELS.length - 1];
  const failureProbabilityPct = clampNumber(
    Math.round(
      100 -
        overallScore +
        criticalCount * 10 +
        analysisSignals.highSeverityIssues * 6
    ),
    4,
    96
  );

  const drivers = [
    {
      label: "Error rate pressure",
      impact: Math.round(averageErrorRatePct * 14),
      detail: `Average error rate is ${roundTo(averageErrorRatePct, 2)}%.`
    },
    {
      label: "Latency expansion",
      impact: Math.round(normalizeRange(averageLatencyMs, 80, 420) * 100),
      detail: `Average request latency is ${roundTo(averageLatencyMs)} ms.`
    },
    {
      label: "Compute saturation",
      impact: Math.round(normalizeRange(averageSaturationPct, 40, 92) * 100),
      detail: `Average saturation is ${roundTo(averageSaturationPct)}%.`
    },
    {
      label: "Detected issue load",
      impact: Math.round(
        normalizeRange(analysisSignals.issuePenalty, 0, 48) * 100
      ),
      detail:
        analysisSignals.issueCount > 0
          ? `${analysisSignals.issueCount} issue${
              analysisSignals.issueCount > 1 ? "s" : ""
            } from the latest assessment are shaping the score.`
          : "No assessment issues are currently pulling the score down."
    }
  ]
    .filter((driver) => driver.impact > 0)
    .sort((left, right) => right.impact - left.impact)
    .slice(0, 4);

  const recommendedActions = [
    criticalCount > 0
      ? "Stabilize critical services before scaling traffic or releasing changes."
      : null,
    averageErrorRatePct >= 1.2
      ? "Trace upstream dependency failures and tighten retry or timeout settings."
      : null,
    averageSaturationPct >= 75
      ? "Increase worker capacity or reduce burst load to recover headroom."
      : null,
    analysisSignals.categories.includes("database")
      ? "Inspect the database tier first because the current signals point to dependency risk."
      : null,
    analysisSignals.categories.includes("network")
      ? "Validate upstream connectivity, DNS, and egress health before the next incident window."
      : null
  ].filter(Boolean);

  return {
    scoringVersion: MONITORING_VERSION,
    engine:
      analysis?.engine === "google_ai_studio" ? "ai_enriched" : "heuristic",
    overallScore,
    label: scoreLabel.label,
    riskLevel: scoreLabel.riskLevel,
    confidencePct:
      analysis?.engine === "google_ai_studio"
        ? 88
        : analysis?.issueCount
          ? 76
          : 68,
    failureProbabilityPct,
    dimensions: [
      { id: "availability", label: "Availability", score: roundTo(availabilityScore, 1) },
      { id: "performance", label: "Performance", score: roundTo(performanceScore, 1) },
      { id: "reliability", label: "Reliability", score: roundTo(reliabilityScore, 1) },
      { id: "resilience", label: "Resilience", score: roundTo(resilienceScore, 1) }
    ],
    drivers,
    recommendedActions
  };
}

function buildServicePrediction(service) {
  const overloadSignal =
    service.cpuPct * 0.24 +
    service.memoryPct * 0.18 +
    service.saturationPct * 0.24 +
    service.errorRatePct * 7 +
    service.restarts * 11;
  const probabilityPct = clampNumber(Math.round(18 + overloadSignal), 12, 96);

  if (
    probabilityPct < 48 &&
    service.status === "healthy" &&
    service.latencyMs < 210 &&
    service.errorRatePct < 1
  ) {
    return null;
  }

  let title = "Latency Breach Risk";
  let summary = `${service.name} is showing early signs of a user-visible slowdown.`;
  let recommendation =
    "Reduce burst traffic or add headroom before customer-facing latency degrades further.";

  if (
    service.cpuPct >= 84 ||
    service.memoryPct >= 88 ||
    service.saturationPct >= 86
  ) {
    title = "Capacity Exhaustion Risk";
    summary = `${service.name} is trending toward compute or memory saturation.`;
    recommendation =
      "Scale the deployment or trim workload concurrency before the service starts shedding traffic.";
  }

  if (service.errorRatePct >= 2.4) {
    title = "Error Budget Burn Risk";
    summary = `${service.name} is already consuming error budget fast enough to trigger a broader incident.`;
    recommendation =
      "Prioritize rollback or dependency isolation to stop the error rate from compounding.";
  }

  if (service.restarts > 0) {
    title = "Restart Cascade Risk";
    summary = `${service.name} is restarting and may enter a churn loop under sustained traffic.`;
    recommendation =
      "Inspect crash causes and remove the restart trigger before additional pods begin recycling.";
  }

  return {
    id: `${service.id}-${title.toLowerCase().replace(/\s+/g, "-")}`,
    title,
    service: service.name,
    severity:
      probabilityPct >= 82 || service.status === "critical" ? "high" : "medium",
    probabilityPct,
    horizonMinutes:
      probabilityPct >= 82 ? 20 : probabilityPct >= 68 ? 35 : 55,
    summary,
    triggers: [
      `Latency ${service.latencyMs} ms`,
      `Errors ${service.errorRatePct}%`,
      `CPU ${service.cpuPct}%`,
      `Memory ${service.memoryPct}%`
    ],
    recommendation
  };
}

function buildAnalysisPredictions(analysis) {
  if (!analysis || !Array.isArray(analysis.issues) || analysis.issues.length === 0) {
    return [];
  }

  return analysis.issues.slice(0, 2).map((issue) => {
    const categoryToTitle = {
      runtime: "Application Crash Recurrence Risk",
      database: "Database Dependency Failure Risk",
      network: "Upstream Connectivity Failure Risk",
      deploy: "Deployment Regression Risk",
      security: "Access Failure Risk"
    };

    return {
      id: `analysis-${issue.id}`,
      title: categoryToTitle[issue.category] || "Incident Expansion Risk",
      service: "Analyzed logs",
      severity: issue.severity,
      probabilityPct:
        issue.severity === "high"
          ? 84
          : issue.severity === "medium"
            ? 64
            : 42,
      horizonMinutes:
        issue.severity === "high"
          ? 15
          : issue.severity === "medium"
            ? 30
            : 60,
      summary: issue.summary,
      triggers: issue.evidence || [],
      recommendation: issue.suggestion
    };
  });
}

function buildPredictions({ services, analysis }) {
  const servicePredictions = services
    .map((service) => buildServicePrediction(service))
    .filter(Boolean);

  return [...servicePredictions, ...buildAnalysisPredictions(analysis)]
    .sort((left, right) => right.probabilityPct - left.probabilityPct)
    .slice(0, 5);
}

function buildEvents({ services, predictions, analysis, timestamp }) {
  const eventTime = new Date(timestamp).toISOString();
  const serviceEvents = services
    .filter((service) => service.status !== "healthy")
    .slice(0, 3)
    .map((service) => ({
      id: `${service.id}-event`,
      time: eventTime,
      severity: service.status === "critical" ? "high" : "medium",
      title: `${service.name} moved to ${service.status}`,
      detail: `${service.latencyMs} ms latency, ${service.errorRatePct}% errors, ${service.cpuPct}% CPU.`
    }));

  const predictionEvents = predictions.slice(0, 2).map((prediction) => ({
    id: `${prediction.id}-event`,
    time: eventTime,
    severity: prediction.severity,
    title: prediction.title,
    detail: `${prediction.service} may fail within ${prediction.horizonMinutes} minutes.`
  }));

  const analysisEvents =
    analysis?.issueCount > 0
      ? [
          {
            id: "analysis-issue-event",
            time: eventTime,
            severity: analysis.severity || "medium",
            title: `Assessment found ${analysis.issueCount} issue${
              analysis.issueCount > 1 ? "s" : ""
            }`,
            detail: analysis.summary
          }
        ]
      : [];

  return [...serviceEvents, ...predictionEvents, ...analysisEvents].slice(0, 5);
}

function buildMonitoringSnapshot(input = {}) {
  const timestamp = input.timestamp || Date.now();
  const servicesFromPayload = normalizeServicesInput(input.services);
  const services =
    servicesFromPayload.length > 0
      ? servicesFromPayload
      : getSyntheticServices(timestamp);
  const analysis =
    input.analysis ||
    (typeof input.logs === "string" && input.logs.trim()
      ? analyzeLogsWithRules(input.logs, {
          engine: "monitoring_rules",
          model: null
        })
      : null);
  const predictions = buildPredictions({ services, analysis });
  const scorecard = buildScorecard({ services, analysis });
  const healthyServices = services.filter(
    (service) => service.status === "healthy"
  ).length;
  const warningServices = services.filter(
    (service) => service.status === "warning"
  ).length;
  const criticalServices = services.filter(
    (service) => service.status === "critical"
  ).length;
  const averageLatencyMs = roundTo(
    services.reduce((total, service) => total + service.latencyMs, 0) /
      (services.length || 1)
  );
  const averageErrorRatePct = roundTo(
    services.reduce((total, service) => total + service.errorRatePct, 0) /
      (services.length || 1),
    2
  );
  const eventRatePerMinute = roundTo(
    services.reduce(
      (total, service) =>
        total + service.throughputRps * (service.errorRatePct / 100),
      0
    ) * 60
  );
  const events = buildEvents({
    services,
    predictions,
    analysis,
    timestamp
  });

  return {
    monitoringVersion: MONITORING_VERSION,
    timestamp: new Date(timestamp).toISOString(),
    mode: servicesFromPayload.length > 0 ? "custom_payload" : "synthetic_live",
    summary: {
      totalServices: services.length,
      healthyServices,
      warningServices,
      criticalServices,
      openIncidents:
        predictions.filter((prediction) => prediction.severity === "high").length +
        (analysis?.issueCount || 0),
      averageLatencyMs,
      averageErrorRatePct,
      eventRatePerMinute
    },
    services,
    scorecard,
    predictions,
    events
  };
}

module.exports = {
  buildMonitoringSnapshot,
  buildPredictions,
  buildScorecard,
  MONITORING_VERSION,
  STREAM_INTERVAL_MS
};
