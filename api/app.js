// cPanel-compatible startup file
// This should be set as the startup file in cPanel Node.js interface

const path = require("path");

// Set the correct working directory
process.chdir(__dirname);

console.log("Starting Attendio API...");
console.log("Working directory:", process.cwd());
console.log("Node.js version:", process.version);

// Import and start the main application
async function startApp() {
  try {
    // Import the ES module
    const app = await import("./index.js");
    console.log("✅ Application started successfully");
  } catch (error) {
    console.error("❌ Failed to start application:", error);
    process.exit(1);
  }
}

startApp();
