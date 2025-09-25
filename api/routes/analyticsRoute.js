import express from "express";
import { authenticateUser } from "../middlware/authMiddleware.js";
import { fetchAttendanceSummary } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/attendance-summary", authenticateUser, fetchAttendanceSummary);

export default router;


