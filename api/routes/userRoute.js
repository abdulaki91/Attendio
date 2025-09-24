// src/routes/user.routes.js
import express from "express";
import {
  changePassword,
  createUserTable,
  getUser,
  getUserById,
  login,
  registerUser,
  updateUser,
  verifyToken,
} from "../controllers/userController.js";
import { authenticateUser } from "../middlware/authMiddleware.js";

const router = express.Router();
router.get("/initialize/create-user-table", createUserTable); // GET /users/initialize → Initialize User table
router.post("/create-user", registerUser); // POST /users → Create user
router.post("/login", login); // POST /users/login → User login
router.get("/get-user", authenticateUser, getUser);
router.get("/verify/:token", verifyToken);
router.put("/update-user", authenticateUser, updateUser);
router.put("/change-password", authenticateUser, changePassword);
router.get("/get-user-by-id/:id", getUserById);

export default router;
