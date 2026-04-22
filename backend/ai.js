function analyzeLogs(logs) {
  if (!logs) return { message: "No logs provided" };

  if (logs.includes("error")) {
    return {
      issue: "Deployment Failure",
      suggestion: "Check container logs and restart pod"
    };
  }

  return {
    issue: "No issues detected",
    suggestion: "System stable"
  };
}

module.exports = { analyzeLogs };