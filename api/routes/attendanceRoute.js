import express from "express";
import { authenticateUser } from "../middlware/authMiddleware.js";
import {
  fetchAttendance,
  fetchStudentsWithAttendance,
  initializeAttendanceTable,
  markAttendance,
} from "../controllers/attendanceController.js";
const router = express.Router();
router.get("/initialize/create-attendance-table", initializeAttendanceTable);
router.post("/create-attendance", authenticateUser, markAttendance); // POST /attendance → Create attendance record

// GET /attendance?date=YYYY-MM-DD
router.get(
  "/fetch-students-with-attendance",
  authenticateUser,
  fetchStudentsWithAttendance
);

// router.get("/get-students", fetchAttendance);

export default router;
