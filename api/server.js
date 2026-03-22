// CommonJS version for cPanel compatibility
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "*", // Allow all origins for now
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  }),
);

app.use(express.json());

// Test route
app.get("/ping", (req, res) => {
  res.json({
    message: "pong from Node.js backend",
    timestamp: new Date().toISOString(),
    cors: "enabled",
  });
});

// Basic login route for testing
app.post("/api/users/login", (req, res) => {
  res.json({
    message: "Login endpoint working",
    body: req.body,
    cors: "working",
  });
});

// Test database connection
async function testDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "test",
    });

    const [rows] = await connection.execute("SELECT NOW() as now");
    console.log("✅ Database connected. Server time:", rows[0].now);
    await connection.end();
  } catch (error) {
    console.log("❌ Database connection failed:", error.message);
  }
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Server running on PORT: ${port}`);
  console.log(`Test URL: http://localhost:${port}/ping`);
  testDatabase();
});

module.exports = app;
