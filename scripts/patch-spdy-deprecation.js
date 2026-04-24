const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");

const filesToPatch = [
  path.join(
    repoRoot,
    "frontend",
    "node_modules",
    "spdy",
    "lib",
    "spdy",
    "server.js"
  ),
  path.join(
    repoRoot,
    "frontend",
    "node_modules",
    "spdy",
    "lib",
    "spdy",
    "agent.js"
  ),
  path.join(
    repoRoot,
    "frontend",
    "node_modules",
    "spdy-transport",
    "lib",
    "spdy-transport",
    "utils.js"
  )
];

const legacyAssignPattern =
  /\/\/ Node\.js [^\n]+\r?\nObject\.assign =[\s\S]*?util\._extend\r?\n/;
const replacementBlock =
  "// Patched for modern Node.js: avoid deprecated util._extend.\nObject.assign = Object.assign\n";

let patchedCount = 0;

for (const targetFile of filesToPatch) {
  if (!fs.existsSync(targetFile)) {
    continue;
  }

  const currentContents = fs.readFileSync(targetFile, "utf8");

  if (currentContents.includes("Patched for modern Node.js")) {
    continue;
  }

  if (!legacyAssignPattern.test(currentContents)) {
    continue;
  }

  const updatedContents = currentContents.replace(
    legacyAssignPattern,
    replacementBlock
  );

  if (updatedContents !== currentContents) {
    fs.writeFileSync(targetFile, updatedContents, "utf8");
    patchedCount += 1;
  }
}

if (patchedCount > 0) {
  console.log(`Patched ${patchedCount} SPDY file(s) for Node.js deprecation compatibility.`);
}
