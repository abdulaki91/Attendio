import bcrypt from "bcryptjs";
import db from "../config/db.config.js";

// Create the users table if it doesn't exist
export const createUsersTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(209) NOT NULL ,
      verificationToken VARCHAR(255) DEFAULT NULL,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  return db.execute(sql);
};

// Insert user into DB
export const insertUser = (name, email, password, verificationToken) => {
  const sql = `
    INSERT INTO users (name, email, password, verificationToken) 
    VALUES (?, ?, ?, ?)
  `;
  return db.execute(sql, [name, email, password, verificationToken]);
};

export const getUserByEmail = (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  return db.query(sql, [email]);
};

export const findUserById = async (id) => {
  const sql = "SELECT * FROM users WHERE id = ?";
  const [results] = await db.query(sql, [id]);
  return results[0];
};

export const loginQuery = (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  return db.query(sql, [email]);
};

// Get all users
export const getAllUsers = () => {
  const sql = `SELECT * FROM users`;
  return db.query(sql);
};

export const updateUserQuery = async (
  id,
  { name, email, verified, verificationToken }
) => {
  const fields = [];
  const params = [];

  if (name) {
    fields.push("name = ?");
    params.push(name);
  }
  if (email) {
    fields.push("email = ?");
    params.push(email);
  }
  if (typeof verified !== "undefined") {
    fields.push("verified = ?");
    params.push(verified);
  }
  if (verificationToken) {
    fields.push("verificationToken = ?");
    params.push(verificationToken);
  }

  if (fields.length === 0) {
    throw new Error("No fields provided for update");
  }

  const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
  params.push(id);

  const [result] = await db.query(sql, params);
  return result;
};

// DB query helper
export const changePasswordQuery = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  return db.execute(sql, [hashedPassword, id]);
};

// Verify user (set verified = true and remove token)
export const verifyUser = (id) => {
  const sql = `UPDATE users SET verified = TRUE, verificationToken = NULL WHERE id = ?`;
  return db.execute(sql, [id]);
};
// Get user by token
export const getUserByToken = (token) => {
  const sql = `SELECT * FROM users WHERE verificationToken = ?`;
  return db.query(sql, [token]);
};
