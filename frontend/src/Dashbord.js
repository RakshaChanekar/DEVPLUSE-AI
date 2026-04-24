import React, { startTransition, useEffect, useState } from "react";
import axios from "axios";

const ROUTE_MISSING_ERROR =
  "The backend is reachable, but this route is missing. Restart the backend so it picks up the latest API endpoints.";

function isLoopbackHostname(hostname) {
  const normalizedHostname = String(hostname || "")
    .toLowerCase()
    .replace(/^\[(.*)\]$/, "$1");

  return (
    normalizedHostname === "localhost" ||
    normalizedHostname === "127.0.0.1" ||
    normalizedHostname === "::1" ||
    normalizedHostname.endsWith(".localhost")
  );
}

function shouldUseProxyApiBase(configuredBaseUrl) {
  if (!configuredBaseUrl || typeof window === "undefined") {
    return false;
  }

  try {
    const parsedBaseUrl = new URL(configuredBaseUrl, window.location.origin);

    return isLoopbackHostname(parsedBaseUrl.hostname);
  } catch (error) {
    return false;
  }
}

function resolveApiBaseUrl() {
  const configuredBaseUrl = (process.env.REACT_APP_API_BASE_URL || "")
    .trim()
    .replace(/\/$/, "");

  if (configuredBaseUrl && !shouldUseProxyApiBase(configuredBaseUrl)) {
    return configuredBaseUrl;
  }

  return "";
}

const API_BASE_URL = resolveApiBaseUrl();

const SAMPLE_LOGS = [
  {
    label: "Infra cascade",
    description: "Network, database, and memory failures in one request",
    value: `[INFO] Server started on port 5000
[ERROR] AxiosError: Network Error
[WARN] Retrying request...
[ERROR] MongoTimeoutError: Server selection timed out
[ERROR] ValueError: Input text is empty
[CRITICAL] JavaScript heap out of memory`
  },
  {
    label: "Module issue",
    description: "Broken dependency boot sequence",
    value: `Error: Cannot find module 'express'
    at Module._resolveFilename (node:internal/modules/cjs/loader:1140:15)
    at Module._load (node:internal/modules/cjs/loader:981:27)`
  },
  {
    label: "Deploy issue",
    description: "Container startup and route failures",
    value: `Back-off restarting failed container
CrashLoopBackOff
Request failed with status code 404
Cannot GET /health`
  },
  {
    label: "Capacity risk",
    description: "Queue pressure, latency climb, and pod churn",
    value: `[WARN] queue depth exceeded 1800 jobs
[WARN] Request timeout after 14000ms
[ERROR] Back-off restarting failed container
[ERROR] JavaScript heap out of memory
[ERROR] AxiosError: Network Error`
  }
];

function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function formatTimestamp(value) {
  if (!value) {
    return "Awaiting stream";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function formatPercent(value, digits = 0) {
  return `${Number(value || 0).toFixed(digits)}%`;
}

function formatMetric(value, suffix = "") {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return "--";
  }

  return `${Number(value).toFixed(Number(value) >= 100 ? 0 : 1)}${suffix}`;
}

function getScoreTone(score) {
  if (score >= 85) {
    return "score-strong";
  }

  if (score >= 65) {
    return "score-guarded";
  }

  return "score-critical";
}

function buildLegacyInsightsPayload(analysis) {
  return {
    timestamp: new Date().toISOString(),
    analysis,
    monitoring: null,
    scorecard: null,
    predictions: []
  };
}

function getRequestErrorMessage(requestError) {
  if (requestError.response?.status === 404) {
    return ROUTE_MISSING_ERROR;
  }

  if (!requestError.response) {
    return "Unable to reach the backend API. Start the backend or set REACT_APP_API_BASE_URL to the correct server.";
  }

  return (
    requestError.response?.data?.suggestion ||
    requestError.response?.data?.message ||
    "Unable to run the assessment right now."
  );
}

function Dashboard() {
  const [logs, setLogs] = useState("");
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    data: null,
    error: ""
  });
  const [monitoring, setMonitoring] = useState({
    loading: true,
    data: null,
    error: "",
    connected: false
  });

  const analysisResult = insights?.analysis || null;
  const assessmentScore = insights?.scorecard || null;
  const assessmentPredictions = insights?.predictions || [];

  const isLegacyResponse =
    analysisResult &&
    (!Object.prototype.hasOwnProperty.call(analysisResult, "analyzerVersion") ||
      !Array.isArray(analysisResult.issues) ||
      !Object.prototype.hasOwnProperty.call(analysisResult, "issueCount"));

  useEffect(() => {
    let isMounted = true;
    let statusInterval;

    async function loadStatus(options = {}) {
      const { preserveExistingData = false } = options;

      try {
        const response = await axios.get(getApiUrl("/api/status"));

        if (!isMounted) {
          return;
        }

        setStatus({
          loading: false,
          data: response.data,
          error: ""
        });
      } catch (statusError) {
        if (!isMounted) {
          return;
        }

        setStatus((current) => ({
          loading: false,
          data: preserveExistingData ? current.data : null,
          error: preserveExistingData && current.data
            ? ""
            : "Backend status unavailable"
        }));
      }
    }

    loadStatus();
    statusInterval = setInterval(() => {
      loadStatus({ preserveExistingData: true });
    }, 15000);

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        loadStatus({ preserveExistingData: true });
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isMounted = false;
      clearInterval(statusInterval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const backendHasLatestApi = Boolean(
      status.data?.monitoringVersion &&
        Array.isArray(status.data?.features) &&
        status.data.features.includes("real_time_monitoring") &&
        status.data.features.includes("ai_scoring_system") &&
        status.data.features.includes("predictive_failure_detection")
    );

    if (backendHasLatestApi && error === ROUTE_MISSING_ERROR) {
      setError("");
    }
  }, [error, status.data]);

  useEffect(() => {
    let isMounted = true;
    let eventSource;

    async function loadSnapshot() {
      try {
        const response = await axios.get(getApiUrl("/api/monitoring/snapshot"));

        if (!isMounted) {
          return;
        }

        setMonitoring((current) => ({
          ...current,
          loading: false,
          data: response.data,
          error: ""
        }));
      } catch (snapshotError) {
        if (!isMounted) {
          return;
        }

        setMonitoring({
          loading: false,
          data: null,
          error: "Monitoring snapshot unavailable",
          connected: false
        });
      }
    }

    loadSnapshot();

    if (typeof EventSource === "undefined") {
      return () => {
        isMounted = false;
      };
    }

    eventSource = new EventSource(getApiUrl("/api/monitoring/stream"));

    eventSource.onmessage = (event) => {
      if (!isMounted) {
        return;
      }

      try {
        const nextSnapshot = JSON.parse(event.data);

        startTransition(() => {
          setMonitoring({
            loading: false,
            data: nextSnapshot,
            error: "",
            connected: true
          });
        });
      } catch (streamError) {
        console.error("Unable to parse monitoring stream payload.", streamError);
      }
    };

    eventSource.onerror = () => {
      if (!isMounted) {
        return;
      }

      setMonitoring((current) => ({
        loading: false,
        data: current.data,
        error: current.data ? "" : "Live monitoring stream unavailable",
        connected: false
      }));
    };

    return () => {
      isMounted = false;

      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  const analyze = async () => {
    setError("");
    setNotice("");
    setInsights(null);

    const cleanedLogs = logs.trim();

    if (!cleanedLogs) {
      setError("Paste logs before analyzing.");
      return;
    }

    if (/^https?:\/\/\S+\/api\/\S*$/i.test(cleanedLogs)) {
      setError("Paste the actual logs or stack trace here, not the API URL.");
      return;
    }

    try {
      setIsAnalyzing(true);
      try {
        const response = await axios.post(getApiUrl("/api/insights"), {
          logs: cleanedLogs
        });

        setInsights(response.data);
      } catch (insightsError) {
        if (insightsError.response?.status !== 404) {
          throw insightsError;
        }

        const fallbackResponse = await axios.post(getApiUrl("/api/analyze"), {
          logs: cleanedLogs
        });

        setNotice(
          "Using compatibility mode because the running backend does not expose /api/insights yet."
        );
        setInsights(buildLegacyInsightsPayload(fallbackResponse.data));
      }
    } catch (requestError) {
      console.error("Error:", requestError);
      setError(getRequestErrorMessage(requestError));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySample = (sample) => {
    setLogs(sample.value);
    setError("");
    setNotice("");
    setInsights(null);
  };

  const clearComposer = () => {
    setLogs("");
    setError("");
    setNotice("");
    setInsights(null);
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="layout">
        <section className="hero card">
          <div className="hero-copy">
            <span className="eyebrow">Live Reliability Intelligence</span>
            <h1>DevPulse AI</h1>
            <p className="hero-text">
              Watch service health move in real time, convert noisy logs into
              structured incident scores, and catch likely failures before they
              turn into outages.
            </p>

            <div className="hero-metrics hero-metrics-wide">
              <div className="metric">
                <span className="metric-value">
                  {monitoring.data?.scorecard?.overallScore || "Calibrating"}
                </span>
                <span className="metric-label">Live stability score</span>
              </div>
              <div className="metric">
                <span className="metric-value">
                  {monitoring.data?.scorecard?.failureProbabilityPct || "--"}%
                </span>
                <span className="metric-label">Failure probability</span>
              </div>
              <div className="metric">
                <span className="metric-value">
                  {monitoring.data?.summary?.totalServices || "--"}
                </span>
                <span className="metric-label">Tracked services</span>
              </div>
              <div className="metric">
                <span className="metric-value">
                  {status.data?.defaultModel || "gemini-2.5-flash"}
                </span>
                <span className="metric-label">Inference model</span>
              </div>
            </div>
          </div>

          <aside className="status-panel">
            <div className="status-header">
              <h2>System readiness</h2>
              <span
                className={`status-badge ${
                  monitoring.connected ? "status-live" : "status-warning"
                }`}
              >
                {monitoring.connected
                  ? "Streaming"
                  : status.loading
                    ? "Checking"
                    : status.data
                      ? "Online"
                      : "Attention"}
              </span>
            </div>

            <div className="status-grid">
              <div className="status-item">
                <span className="status-label">Backend</span>
                <span className="status-value">
                  {status.loading
                    ? "Connecting..."
                    : status.data?.status || status.error}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Environment</span>
                <span className="status-value">
                  {status.data?.environment || "Unknown"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Monitoring engine</span>
                <span className="status-value">
                  {status.data?.monitoringVersion || "Booting"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Last snapshot</span>
                <span className="status-value">
                  {formatTimestamp(monitoring.data?.timestamp)}
                </span>
              </div>
            </div>

            {!status.loading && !status.data?.providerConfigured && (
              <p className="status-note">
                Google AI Studio is not configured yet, so DevPulse will keep
                using local analysis heuristics for scoring and prediction.
              </p>
            )}
          </aside>
        </section>

        <section className="monitoring-grid">
          <section className="monitor-board card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Real-time monitoring</span>
                <h2>Live service radar</h2>
              </div>
              <span
                className={`status-badge ${
                  monitoring.connected ? "status-live" : "status-warning"
                }`}
              >
                {monitoring.connected ? "Live feed" : "Snapshot"}
              </span>
            </div>

            {monitoring.data ? (
              <>
                <div className="monitor-summary-grid">
                  <div className="monitor-summary-card">
                    <span className="status-label">Healthy</span>
                    <strong>{monitoring.data.summary.healthyServices}</strong>
                  </div>
                  <div className="monitor-summary-card">
                    <span className="status-label">Warning</span>
                    <strong>{monitoring.data.summary.warningServices}</strong>
                  </div>
                  <div className="monitor-summary-card">
                    <span className="status-label">Critical</span>
                    <strong>{monitoring.data.summary.criticalServices}</strong>
                  </div>
                  <div className="monitor-summary-card">
                    <span className="status-label">Error events/min</span>
                    <strong>{monitoring.data.summary.eventRatePerMinute}</strong>
                  </div>
                </div>

                <div className="service-grid">
                  {monitoring.data.services.map((service) => (
                    <article
                      key={service.id}
                      className={`service-card service-${service.status}`}
                    >
                      <div className="service-card-header">
                        <div>
                          <h3>{service.name}</h3>
                          <p>{service.tier}</p>
                        </div>
                        <span
                          className={`severity severity-${service.status === "healthy" ? "low" : service.status === "critical" ? "high" : "medium"}`}
                        >
                          {service.status}
                        </span>
                      </div>

                      <div className="service-stats-grid">
                        <div>
                          <span className="status-label">Latency</span>
                          <strong>{formatMetric(service.latencyMs, " ms")}</strong>
                        </div>
                        <div>
                          <span className="status-label">Errors</span>
                          <strong>{formatPercent(service.errorRatePct, 2)}</strong>
                        </div>
                        <div>
                          <span className="status-label">Throughput</span>
                          <strong>{formatMetric(service.throughputRps, " rps")}</strong>
                        </div>
                        <div>
                          <span className="status-label">Restarts</span>
                          <strong>{service.restarts}</strong>
                        </div>
                      </div>

                      <div className="meter-stack">
                        <div className="meter-row">
                          <span>CPU</span>
                          <div className="meter-track">
                            <div
                              className="meter-fill"
                              style={{ width: `${service.cpuPct}%` }}
                            />
                          </div>
                          <strong>{formatPercent(service.cpuPct)}</strong>
                        </div>
                        <div className="meter-row">
                          <span>Memory</span>
                          <div className="meter-track">
                            <div
                              className="meter-fill meter-fill-accent"
                              style={{ width: `${service.memoryPct}%` }}
                            />
                          </div>
                          <strong>{formatPercent(service.memoryPct)}</strong>
                        </div>
                        <div className="meter-row">
                          <span>Saturation</span>
                          <div className="meter-track">
                            <div
                              className="meter-fill meter-fill-warning"
                              style={{ width: `${service.saturationPct}%` }}
                            />
                          </div>
                          <strong>{formatPercent(service.saturationPct)}</strong>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <p>
                  {monitoring.loading
                    ? "Loading monitoring snapshot..."
                    : monitoring.error}
                </p>
              </div>
            )}
          </section>

          <div className="monitor-side-column">
            <section className="score-panel card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">AI scoring system</span>
                  <h2>Operational scorecard</h2>
                </div>
              </div>

              {monitoring.data?.scorecard ? (
                <div className="score-panel-content">
                  <div
                    className={`score-orb ${getScoreTone(
                      monitoring.data.scorecard.overallScore
                    )}`}
                  >
                    <span>{monitoring.data.scorecard.overallScore}</span>
                    <small>{monitoring.data.scorecard.label}</small>
                  </div>

                  <div className="pill-row">
                    <span className="pill pill-dark">
                      Risk: {monitoring.data.scorecard.riskLevel}
                    </span>
                    <span className="pill">
                      Confidence: {monitoring.data.scorecard.confidencePct}%
                    </span>
                    <span className="pill">
                      Engine: {monitoring.data.scorecard.engine}
                    </span>
                  </div>

                  <div className="dimension-list">
                    {monitoring.data.scorecard.dimensions.map((dimension) => (
                      <div key={dimension.id} className="dimension-row">
                        <div className="dimension-header">
                          <span>{dimension.label}</span>
                          <strong>{dimension.score}</strong>
                        </div>
                        <div className="meter-track">
                          <div
                            className="meter-fill"
                            style={{ width: `${dimension.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="insight-list">
                    {monitoring.data.scorecard.drivers.map((driver) => (
                      <article key={driver.label} className="insight-item">
                        <strong>{driver.label}</strong>
                        <p>{driver.detail}</p>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <p>Scorecard data is still warming up.</p>
                </div>
              )}
            </section>

            <section className="prediction-panel card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Predictive failure detection</span>
                  <h2>Risk forecast</h2>
                </div>
              </div>

              {monitoring.data?.predictions?.length ? (
                <div className="prediction-list">
                  {monitoring.data.predictions.map((prediction) => (
                    <article key={prediction.id} className="prediction-card">
                      <div className="issue-header">
                        <h3>{prediction.title}</h3>
                        <span
                          className={`severity severity-${prediction.severity || "medium"}`}
                        >
                          {prediction.severity}
                        </span>
                      </div>
                      <p className="issue-category">{prediction.service}</p>
                      <p>{prediction.summary}</p>
                      <p className="issue-suggestion">
                        {prediction.recommendation}
                      </p>
                      <div className="pill-row">
                        <span className="pill">
                          Probability: {prediction.probabilityPct}%
                        </span>
                        <span className="pill">
                          Horizon: {prediction.horizonMinutes} min
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No elevated failure patterns detected right now.</p>
                </div>
              )}
            </section>

            <section className="event-panel card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Ops feed</span>
                  <h2>Recent events</h2>
                </div>
              </div>

              {monitoring.data?.events?.length ? (
                <div className="event-list">
                  {monitoring.data.events.map((event) => (
                    <article key={event.id} className="event-item">
                      <div className="event-meta">
                        <span
                          className={`severity severity-${event.severity || "medium"}`}
                        >
                          {event.severity}
                        </span>
                        <small>{formatTimestamp(event.time)}</small>
                      </div>
                      <strong>{event.title}</strong>
                      <p>{event.detail}</p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <p>Incident feed will appear here as the stream updates.</p>
                </div>
              )}
            </section>
          </div>
        </section>

        <section className="workspace">
          <div className="composer card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Assessment workspace</span>
                <h2>Paste logs and generate an AI-backed risk assessment</h2>
              </div>
              <div className="action-row">
                <button
                  className="button button-secondary"
                  onClick={clearComposer}
                  type="button"
                >
                  Clear
                </button>
                <button
                  className="button button-primary"
                  onClick={analyze}
                  disabled={isAnalyzing}
                  type="button"
                >
                  {isAnalyzing ? "Assessing..." : "Run Assessment"}
                </button>
              </div>
            </div>

            <div className="sample-list">
              {SAMPLE_LOGS.map((sample) => (
                <button
                  key={sample.label}
                  className="sample-chip"
                  onClick={() => applySample(sample)}
                  type="button"
                >
                  <span>{sample.label}</span>
                  <small>{sample.description}</small>
                </button>
              ))}
            </div>

            <textarea
              className="log-input"
              placeholder={
                "Paste raw logs here...\n\nExample:\nFATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory\nError: connect ECONNREFUSED 127.0.0.1:5432"
              }
              value={logs}
              onChange={(event) => setLogs(event.target.value)}
              rows={14}
            />

            {error && <p className="message message-error">{error}</p>}
            {notice && <p className="message message-warning">{notice}</p>}

            {isLegacyResponse && (
              <p className="message message-warning">
                The backend server is running old analyzer code. Restart the
                backend and try again.
              </p>
            )}
          </div>

          <div className="results-column">
            <section className="overview card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">Assessment overview</span>
                  <h2>
                    {analysisResult
                      ? analysisResult.issueCount > 0
                        ? `${analysisResult.issueCount} issue${
                            analysisResult.issueCount > 1 ? "s" : ""
                          } detected`
                        : analysisResult.issue
                      : "Ready to inspect production logs"}
                  </h2>
                </div>
              </div>

              {analysisResult ? (
                <div className="overview-content">
                  <div className="pill-row">
                    <span className="pill pill-dark">
                      Primary: {analysisResult.issue}
                    </span>
                    <span className="pill">
                      Severity: {analysisResult.severity || "unknown"}
                    </span>
                    {analysisResult.engine && (
                      <span className="pill">Engine: {analysisResult.engine}</span>
                    )}
                    {analysisResult.model && (
                      <span className="pill">Model: {analysisResult.model}</span>
                    )}
                  </div>

                  <p className="overview-summary">{analysisResult.summary}</p>
                  <p className="overview-suggestion">
                    {analysisResult.suggestion}
                  </p>

                  {analysisResult.categories?.length > 0 && (
                    <p className="metadata-line">
                      Categories: {analysisResult.categories.join(", ")}
                    </p>
                  )}
                  {analysisResult.analyzerVersion && (
                    <p className="metadata-line">
                      Analyzer version: {analysisResult.analyzerVersion}
                    </p>
                  )}
                  {analysisResult.fallbackReason && (
                    <p className="metadata-line metadata-warning">
                      Fallback reason: {analysisResult.fallbackReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>
                    Drop in logs from your app, infra, or CI pipeline to receive
                    issue separation, a reliability score, and early failure
                    warnings.
                  </p>
                </div>
              )}
            </section>

            {assessmentScore && (
              <section className="assessment-card card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">AI score</span>
                    <h2>Failure readiness scorecard</h2>
                  </div>
                </div>

                <div className="assessment-score-header">
                  <div className={`score-orb ${getScoreTone(assessmentScore.overallScore)}`}>
                    <span>{assessmentScore.overallScore}</span>
                    <small>{assessmentScore.label}</small>
                  </div>

                  <div className="assessment-meta">
                    <div className="pill-row">
                      <span className="pill pill-dark">
                        Failure probability: {assessmentScore.failureProbabilityPct}%
                      </span>
                      <span className="pill">
                        Confidence: {assessmentScore.confidencePct}%
                      </span>
                    </div>
                    <div className="dimension-list">
                      {assessmentScore.dimensions.map((dimension) => (
                        <div key={dimension.id} className="dimension-row">
                          <div className="dimension-header">
                            <span>{dimension.label}</span>
                            <strong>{dimension.score}</strong>
                          </div>
                          <div className="meter-track">
                            <div
                              className="meter-fill"
                              style={{ width: `${dimension.score}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {assessmentScore.recommendedActions?.length > 0 && (
                  <div className="note-list">
                    {assessmentScore.recommendedActions.map((action) => (
                      <p key={action} className="status-note compact-note">
                        {action}
                      </p>
                    ))}
                  </div>
                )}
              </section>
            )}

            {assessmentPredictions.length > 0 && (
              <section className="prediction-panel card">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">Predicted failures</span>
                    <h2>What is likely to break next</h2>
                  </div>
                </div>

                <div className="prediction-list">
                  {assessmentPredictions.map((prediction) => (
                    <article key={prediction.id} className="prediction-card">
                      <div className="issue-header">
                        <h3>{prediction.title}</h3>
                        <span
                          className={`severity severity-${prediction.severity || "medium"}`}
                        >
                          {prediction.severity}
                        </span>
                      </div>
                      <p className="issue-category">{prediction.service}</p>
                      <p>{prediction.summary}</p>
                      <p className="issue-suggestion">
                        {prediction.recommendation}
                      </p>

                      <div className="pill-row">
                        <span className="pill">
                          Probability: {prediction.probabilityPct}%
                        </span>
                        <span className="pill">
                          Horizon: {prediction.horizonMinutes} min
                        </span>
                      </div>

                      {prediction.triggers?.length > 0 && (
                        <div className="evidence-block">
                          <h4>Signals</h4>
                          <ul>
                            {prediction.triggers.map((trigger, index) => (
                              <li key={`${prediction.id}-${index}`}>
                                <code>{trigger}</code>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            )}

            {analysisResult?.issues?.length > 0 && (
              <section className="issues-grid">
                {analysisResult.issues.map((issue) => (
                  <article key={issue.id} className="issue-card card">
                    <div className="issue-header">
                      <h3>{issue.issue}</h3>
                      <span
                        className={`severity severity-${issue.severity || "medium"}`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    <p className="issue-category">{issue.category}</p>
                    <p>{issue.summary}</p>
                    <p className="issue-suggestion">{issue.suggestion}</p>

                    {issue.evidence?.length > 0 && (
                      <div className="evidence-block">
                        <h4>Evidence</h4>
                        <ul>
                          {issue.evidence.map((line, index) => (
                            <li key={`${issue.id}-${index}`}>
                              <code>{line}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </article>
                ))}
              </section>
            )}

            {analysisResult &&
              analysisResult.issueCount === 0 &&
              analysisResult.evidence?.length > 0 && (
                <section className="card">
                  <h3>Evidence reviewed</h3>
                  <ul className="evidence-list">
                    {analysisResult.evidence.map((line, index) => (
                      <li key={`${line}-${index}`}>
                        <code>{line}</code>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
