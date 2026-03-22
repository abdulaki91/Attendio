// Diagnostic script to check production environment
// Upload this to your production server and run: node diagnostic.js

console.log("=== Production Environment Diagnostic ===");
console.log("Node.js Version:", process.version);
console.log("Platform:", process.platform);
console.log("Current Directory:", process.cwd());
console.log("Environment Variables:");
console.log("- NODE_ENV:", process.env.NODE_ENV);
console.log("- PORT:", process.env.PORT);

// Test if we can create a simple server
import express from "express";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: "https://attendio.abdiko.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.get("/diagnostic", (req, res) => {
  res.json({
    message: "Node.js is working!",
    timestamp: new Date().toISOString(),
    headers: req.headers,
    cors: "enabled",
  });
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Diagnostic server running on port ${port}`);
  console.log(`Test URL: http://localhost:${port}/diagnostic`);
  console.log("If you see this message, Node.js is working correctly.");
});

// Test database connection if possible
try {
  console.log("Checking for .env file...");
  import("dotenv")
    .then((dotenv) => {
      dotenv.config();
      console.log("✅ dotenv loaded");
    })
    .catch((err) => {
      console.log("❌ dotenv not available:", err.message);
    });
} catch (err) {
  console.log("❌ Error loading environment:", err.message);
}
