// src/controllers/user.controller.js
import {
  insertUser,
  createUsersTable,
  updateUserQuery,
  getUserByEmail,
  verifyUser,
  getUserByToken,
  changePasswordQuery,
  loginQuery,
  findUserById,
} from "../models/userModel.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/email.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// create User table
export const createUserTable = async (req, res, next) => {
  try {
    await createUsersTable(); // Create table if it doesn't exist
    res.status(200).json({ message: "Users table is ready." });
  } catch (err) {
    next(err);
  }
};

// Register & send verification email
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    // 1) Check if email already exists
    const [existingUser] = await getUserByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 2) Generate token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 3) Save user
    await insertUser(name, email, hashedPassword, verificationToken);

    // 4) Send email
    const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify/${verificationToken}`;
    await sendEmail({
      email,
      subject: "Verify your account",
      verifyUrl,
      name,
    });

    res
      .status(201)
      .json({ message: "User registered. Please check your email to verify." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  try {
    const { token } = req.params; // /verify/:token

    // 1) Check if token exists in DB
    const [user] = await getUserByToken(token);

    if (user.length === 0) {
      return res.status(400).send("<h3>Invalid or expired token.</h3>");
    }

    // 2) Update user -> verified
    await verifyUser(user[0].id);

    // 3) Redirect to frontend login page
    return res.redirect(`${process.env.CLIENT_URL}/login?verified=true`);
    // e.g., http://localhost:3000/login for React frontend
  } catch (err) {
    console.log(err);
    return res.status(404).send("<h3>Verification failed. Try again.</h3>");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Fetch user
    const [rows] = await loginQuery(email);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 2) Check if verified
    if (!user.verified) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
      });
    }

    // 3) Compare password (hashed in DB)
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4) Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};
// get user by id
export const getUserById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const user = await findUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err });
  }
};
export const getUser = (req, res) => {
  const user = req.user; // Get user from request

  if (!user || user.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  // If user is an array, return the first object
  res.status(200).json(user[0]);
};

export const updateUser = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = req.body;

    let verificationToken = null;

    // Check if email is changing
    if (email && email !== user.email) {
      verificationToken = crypto.randomBytes(32).toString("hex");

      // Update with new email, set verified = 0, add verification token
      await updateUserQuery(user.id, {
        name,
        email,
        verified: 0,
        verificationToken,
      });

      // Send verification email
      const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify/${verificationToken}`;
      await sendEmail({
        email,
        subject: "Verify your new email address",
        verifyUrl,
        name: name || user.name,
      });

      return res.status(200).json({
        message:
          "Email updated. Please check your new email to verify your account.",
      });
    }

    // If email is not changing, just update name or other fields
    await updateUserQuery(user.id, { name });

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    next(err);
  }
};
// / Express route handler
export const changePassword = async (req, res, next) => {
  try {
    const user = req.user; // from auth middleware
    const { currentPassword, newPassword } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1) Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // 2) Update user password
    await changePasswordQuery(user.id, newPassword);

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    console.error("Error changing password:", err);
    next(err);
  }
};
