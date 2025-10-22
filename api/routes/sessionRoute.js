import { createSessionTable } from "../models/sessionModel.js";
import { authenticateUser } from "../middlware/authMiddleware.js";
import { createSession } from "../controllers/sessionController.js";
import express from "express";
const router = express.Router();
router.get("/create-session-table", authenticateUser, createSessionTable);
router.post("/create-session", authenticateUser, createSession);
export default router;
