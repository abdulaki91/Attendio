// Minimal test server to verify Node.js is working
// Use this as startup file in cPanel to test

const http = require("http");

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Content-Type", "application/json");

  // Handle OPTIONS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Simple response
  const response = {
    message: "Node.js is working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    nodeVersion: process.version,
    platform: process.platform,
    cwd: process.cwd(),
  };

  res.writeHead(200);
  res.end(JSON.stringify(response, null, 2));
});

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`✅ Test server running on port ${port}`);
  console.log(`Test URL: http://localhost:${port}`);
  console.log("If you see this in logs, Node.js is working!");
});

// Log any errors
server.on("error", (error) => {
  console.error("❌ Server error:", error);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught exception:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled rejection:", error);
});
