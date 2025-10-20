import db from "../config/db.js";
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
