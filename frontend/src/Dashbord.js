import React, { useEffect, useState } from "react";
import axios from "axios";

function resolveApiBaseUrl() {
  const configuredBaseUrl = (process.env.REACT_APP_API_BASE_URL || "").replace(
    /\/$/,
    ""
  );

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    return `http://${window.location.hostname}:5000`;
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
  }
];

function getApiUrl(path) {
  return `${API_BASE_URL}${path}`;
}

function Dashboard() {
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [status, setStatus] = useState({
    loading: true,
    data: null,
    error: ""
  });

  const isLegacyResponse =
    result &&
    (!Object.prototype.hasOwnProperty.call(result, "analyzerVersion") ||
      !Array.isArray(result.issues) ||
      !Object.prototype.hasOwnProperty.call(result, "issueCount"));

  useEffect(() => {
    let isMounted = true;

    async function loadStatus() {
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

        setStatus({
          loading: false,
          data: null,
          error: "Backend status unavailable"
        });
      }
    }

    loadStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const analyze = async () => {
    setError("");
    setResult(null);

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
      const response = await axios.post(getApiUrl("/api/analyze"), {
        logs: cleanedLogs
      });

      setResult(response.data);
    } catch (requestError) {
      console.error("Error:", requestError);
      setError(
        requestError.response?.data?.suggestion ||
          "Unable to analyze logs right now. Check that the backend is running and reachable."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const applySample = (sample) => {
    setLogs(sample.value);
    setError("");
    setResult(null);
  };

  const clearComposer = () => {
    setLogs("");
    setError("");
    setResult(null);
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <main className="layout">
        <section className="hero card">
          <div className="hero-copy">
            <span className="eyebrow">DevOps Intelligence Platform</span>
            <h1>DevPulse AI</h1>
            <p className="hero-text">
              Turn raw production noise into structured issue reports your team
              can act on fast. Built for support queues, incident triage, and
              startup teams that need answers before customers churn.
            </p>

            <div className="hero-metrics">
              <div className="metric">
                <span className="metric-value">
                  {status.data?.providerConfigured
                    ? "AI Studio Live"
                    : "Fallback Ready"}
                </span>
                <span className="metric-label">Inference mode</span>
              </div>
              <div className="metric">
                <span className="metric-value">
                  {status.data?.defaultModel || "gemini-2.5-flash"}
                </span>
                <span className="metric-label">Default model</span>
              </div>
              <div className="metric">
                <span className="metric-value">
                  {status.data?.analyzerVersion || "Checking"}
                </span>
                <span className="metric-label">Analyzer version</span>
              </div>
            </div>
          </div>

          <aside className="status-panel">
            <div className="status-header">
              <h2>System readiness</h2>
              <span
                className={`status-badge ${
                  status.data ? "status-live" : "status-warning"
                }`}
              >
                {status.loading
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
                <span className="status-label">
                  {status.data?.provider || "Google AI Studio"}
                </span>
                <span className="status-value">
                  {status.data?.providerConfigured
                    ? "Configured"
                    : "Not configured"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">API base</span>
                <span className="status-value">
                  {API_BASE_URL || "Same origin"}
                </span>
              </div>
            </div>

            {!status.loading && !status.data?.providerConfigured && (
              <p className="status-note">
                Google AI Studio is not configured yet, so the product will use
                its local fallback analyzer until you add `GEMINI_API_KEY`.
              </p>
            )}
          </aside>
        </section>

        <section className="workspace">
          <div className="composer card">
            <div className="section-heading">
              <div>
                <span className="eyebrow">Analysis workspace</span>
                <h2>Paste logs, stack traces, or terminal output</h2>
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
                  {isAnalyzing ? "Analyzing..." : "Analyze Issues"}
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
                  <span className="eyebrow">Analysis overview</span>
                  <h2>
                    {result
                      ? result.issueCount > 0
                        ? `${result.issueCount} issue${
                            result.issueCount > 1 ? "s" : ""
                          } detected`
                        : result.issue
                      : "Ready to inspect production logs"}
                  </h2>
                </div>
              </div>

              {result ? (
                <div className="overview-content">
                  <div className="pill-row">
                    <span className="pill pill-dark">
                      Primary: {result.issue}
                    </span>
                    <span className="pill">
                      Severity: {result.severity || "unknown"}
                    </span>
                    {result.engine && <span className="pill">Engine: {result.engine}</span>}
                    {result.model && <span className="pill">Model: {result.model}</span>}
                  </div>

                  <p className="overview-summary">{result.summary}</p>
                  <p className="overview-suggestion">{result.suggestion}</p>

                  {result.categories?.length > 0 && (
                    <p className="metadata-line">
                      Categories: {result.categories.join(", ")}
                    </p>
                  )}
                  {result.analyzerVersion && (
                    <p className="metadata-line">
                      Analyzer version: {result.analyzerVersion}
                    </p>
                  )}
                  {result.fallbackReason && (
                    <p className="metadata-line metadata-warning">
                      Fallback reason: {result.fallbackReason}
                    </p>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <p>
                    Drop in logs from your app, infra, or CI pipeline to receive
                    a structured incident summary with separated findings.
                  </p>
                </div>
              )}
            </section>

            {result?.issues?.length > 0 && (
              <section className="issues-grid">
                {result.issues.map((issue) => (
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

            {result && result.issueCount === 0 && result.evidence?.length > 0 && (
              <section className="card">
                <h3>Evidence reviewed</h3>
                <ul className="evidence-list">
                  {result.evidence.map((line, index) => (
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
