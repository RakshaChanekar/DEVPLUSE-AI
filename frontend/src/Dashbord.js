import React, { useState } from "react";
import axios from "axios";

function Dashboard() {
  const [logs, setLogs] = useState("");
  const [result, setResult] = useState(null);

  const analyze = async () => {
    const res = await axios.post("http://localhost:5000/api/analyze", { logs });
    setResult(res.data);
  };

  return (
    <div>
      <textarea
        placeholder="Paste logs here..."
        onChange={(e) => setLogs(e.target.value)}
      />
      <button onClick={analyze}>Analyze</button>

      {result && (
        <div>
          <h3>Issue: {result.issue}</h3>
          <p>Suggestion: {result.suggestion}</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;