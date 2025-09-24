import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const db = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "attendance",
  port: 3306,
});

console.log("Connected to MySQL");

export default db;
