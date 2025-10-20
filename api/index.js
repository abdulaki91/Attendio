// Load environment variables
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// Import MySQL connection
import db from "./config/db.config.js";

// Import routes (static import, no top-level await)
import userRoutes from "./routes/userRoute.js";
import studentRoutes from "./routes/studentRoute.js";
import attendanceRoutes from "./routes/attendanceRoute.js";
import sessionRoute from "./routes/sessionRoute.js";

const app = express();

// --- Middleware ---
app.use(
  cors({
    origin: ["http://localhost:5173", "https://attendio.abdiko.com"], // your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // if you use cookies or tokens
  })
);
app.use(express.json());

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/session", sessionRoute);

// --- Test MySQL connection on startup ---
(async () => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    console.log("MySQL connected. Server time:", rows[0].now);
  } catch (err) {
    console.error("MySQL connection failed:", err);
  }
})();

// --- Ping route for testing backend reachability ---
app.get("/ping", (req, res) => {
  res.json({ msg: "pong from Node.js backend" });
});

// --- Start server ---
// Passenger ignores the port, but this works locally
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(` Server running on PORT: ${port}`);
});
