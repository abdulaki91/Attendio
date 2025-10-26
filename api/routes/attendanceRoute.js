import express from "express";
import { authenticateUser } from "../middlware/authMiddleware.js";
import {
  fetchAllMissedAttendance,
  // fetchAttendance,
  fetchMissedAttendanceById,
  fetchStudentsWithAttendance,
  initializeAttendanceTable,
  markAttendance,
} from "../controllers/attendanceController.js";
import { getLatest } from "../models/attendanceModel.js";
const router = express.Router();
router.get(
  "/initialize/create-attendance-table",
  authenticateUser,
  initializeAttendanceTable
);
router.post("/create-attendance", authenticateUser, markAttendance); // POST /attendance → Create attendance record

// GET /attendance?date=YYYY-MM-DD
router.get(
  "/fetch-students-with-attendance",
  authenticateUser,
  fetchStudentsWithAttendance
);

// Dashboard summary endpoint
// router.get("/get-attendance", authenticateUser, fetchAttendance);
router.get("/missed", authenticateUser, fetchAllMissedAttendance);
router.get("/missed/:studentId", authenticateUser, fetchMissedAttendanceById);
router.get("/get-latest", authenticateUser, getLatest); // GET /api/attendance/get-latest

// Missed attendance counts per student

export default router;
