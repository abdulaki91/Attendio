import db from "../config/db.config.js";
export const createSessionTable = () => {
  const sql = `CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  teacher_id INT NOT NULL,
  department VARCHAR(100) NOT NULL,
  batch VARCHAR(50),
  section VARCHAR(50),
  session_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_session (teacher_id, department, batch, section, session_date)
);
`;
  return db.execute(sql);
};

export const findExistingSession = async (
  teacher_id,
  department,
  batch,
  section,
  session_date
) => {
  const [rows] = await db.execute(
    `SELECT * FROM sessions WHERE teacher_id=? AND department=? AND batch=? AND section=? AND session_date=?`,
    [teacher_id, department, batch, section, session_date]
  );
  return rows;
};

export const insertSession = async (
  teacher_id,
  department,
  batch,
  section,
  session_date
) => {
  const [result] = await db.execute(
    `INSERT INTO sessions (teacher_id, department, batch, section, session_date)
     VALUES (?, ?, ?, ?, ?)`,
    [teacher_id, department, batch, section, session_date]
  );
  return result.insertId;
};
export const findSessionByTeacherAndDate = async (teacher_id, session_date) => {
  const [rows] = await db.execute(
    `SELECT * FROM sessions WHERE teacher_id=? AND session_date=?`,
    [teacher_id, session_date]
  );
  return rows;
};
