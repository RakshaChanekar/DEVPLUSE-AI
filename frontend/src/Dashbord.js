import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/analyze";

function Dashboard() {
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
      const res = await axios.post(API_URL, {
        logs: cleanedLogs
      });

      setResult(res.data);
    } catch (error) {
      console.error("Error:", error);
      setError(
        error.response?.data?.suggestion ||
          "Unable to analyze logs right now. Check that the backend is running on port 5000."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div style={{ maxWidth: "900px" }}>
      <p>
        Paste raw logs, stack traces, or terminal errors here. Do not paste the
        API URL itself.
      </p>

      <textarea
        placeholder={
          "Example:\nFATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory\nor\nError: connect ECONNREFUSED 127.0.0.1:5432"
        }
        value={logs}
        onChange={(e) => setLogs(e.target.value)}
        rows={10}
        style={{ width: "100%", fontFamily: "monospace" }}
      />

      <button onClick={analyze} disabled={isAnalyzing}>
        {isAnalyzing ? "Analyzing..." : "Analyze"}
      </button>

      {error && <p>{error}</p>}

      {result && (
        <div style={{ marginTop: "24px" }}>
          <h3>Issue: {result.issue}</h3>
          <p>Severity: {result.severity}</p>
          <p>Summary: {result.summary}</p>
          <p>Suggestion: {result.suggestion}</p>

          {result.evidence?.length > 0 && (
            <div>
              <h4>Evidence</h4>
              <ul>
                {result.evidence.map((line, index) => (
                  <li key={`${line}-${index}`}>
                    <code>{line}</code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
