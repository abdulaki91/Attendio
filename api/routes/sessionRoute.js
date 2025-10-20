import { createSession } from "react-router-dom";
import { createSessionTable } from "../models/SessionModel";
import { authenticateUser } from "../middlware/authMiddleware";

router.get("/create-session-table", createSessionTable);
router.post("/create-session", authenticateUser, createSession);
