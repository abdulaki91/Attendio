import { createSessionTable } from "../models/sessionModel.js";
import { authenticateUser } from "../middlware/authMiddleware.js";
import {
  createSession,
  getSessionsWithAttendanceByTeacher,
} from "../controllers/sessionController.js";
import express from "express";
const router = express.Router();
router.get("/create-session-table", authenticateUser, createSessionTable);
router.post("/create-session", authenticateUser, createSession);
router.get(
  "/get-all-sessions",
  authenticateUser,
  getSessionsWithAttendanceByTeacher
);

export default router;
