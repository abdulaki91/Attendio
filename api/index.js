import db from "./config/db.config.js"; // Import your MySQL connection
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const userRoutes = await import("./routes/userRoute.js");
const studentRoutes = await import("./routes/studentRoute.js");
const attendanceRoute = await import("./routes/attendanceRoute.js");
const analyticsRoute = await import("./routes/analyticsRoute.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes.default);
app.use("/api/students", studentRoutes.default);
app.use("/api/attendance", attendanceRoute.default);
app.use("/api/analytics", analyticsRoute.default);
// Test MySQL connection on startup
(async () => {
  try {
    const [rows] = await db.query("SELECT NOW() AS now");
    console.log("MySQL connected. Server time:", rows[0].now);
  } catch (err) {
    console.error("MySQL connection failed:", err);
  }
})();

// Make sure your .env has PORT=5000 (or whatever port you want)
const port = 5000;

app.listen(port, () => {
  console.log(`Server running on PORT: ${port}`);
});
