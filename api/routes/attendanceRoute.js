import express from "express";
import { authenticateUser } from "../middlware/authMiddleware.js";
import {
  createSession,
  fetchAllMissedAttendance,
  fetchAttendance,
  fetchMissedAttendanceById,
  fetchStudentsWithAttendance,
  initializeAttendanceTable,
  markAttendance,
} from "../controllers/attendanceController.js";
import { createSessionTable } from "../models/attendanceModel.js";
const router = express.Router();
router.get("/initialize/create-attendance-table", initializeAttendanceTable);
router.post("/create-attendance", authenticateUser, markAttendance); // POST /attendance → Create attendance record

// GET /attendance?date=YYYY-MM-DD
router.get(
  "/fetch-students-with-attendance",
  authenticateUser,
  fetchStudentsWithAttendance
);

// Dashboard summary endpoint
router.get("/get-attendance", authenticateUser, fetchAttendance);
router.get("/missed", fetchAllMissedAttendance);
router.get("/missed/:studentId", fetchMissedAttendanceById);
router.post("/create-session-table", authenticateUser, createSessionTable);
router.post("/create-session", authenticateUser, createSession);
// Missed attendance counts per student

export default router;
