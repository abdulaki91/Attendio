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

export const getSessionsWithAttendance = async (teacher_id) => {
  const [rows] = await db.execute(
    `
    SELECT 
    s.id AS session_id,
    s.department,
    s.batch,
    s.section,
    s.session_date,
    s.created_at AS session_created_at,
    
    st.id AS student_id,
    st.fullname AS student_name,
    st.id_number,
    st.gender,
    st.department AS st_department,
    a.id AS attendance_id,
    a.status AS attendance_status,
    a.attendance_date,
    a.created_at AS attendance_created_at,
    a.updated_at AS attendance_updated_at,
    
    u.id AS teacher_id,
    u.name AS teacher_name,
    u.email AS teacher_email
FROM sessions s
LEFT JOIN attendance a ON s.id = a.session_id
LEFT JOIN students st ON a.student_id = st.id
LEFT JOIN users u ON s.teacher_id = u.id
WHERE s.teacher_id = ?
ORDER BY s.session_date DESC, st.fullname ASC
    `,
    [teacher_id]
  );

  // Group by session_id
  const sessionsMap = {};
  for (const row of rows) {
    if (!sessionsMap[row.session_id]) {
      sessionsMap[row.session_id] = {
        session_id: row.session_id,
        department: row.department,
        batch: row.batch,
        section: row.section,
        session_date: row.session_date,
        teacher: {
          id: row.teacher_id,
          name: row.teacher_name,
          email: row.teacher_email,
        },
        created_at: row.session_created_at,
        attendance: [],
      };
    }

    if (row.student_id) {
      sessionsMap[row.session_id].attendance.push({
        attendance_id: row.attendance_id,
        student_id: row.student_id,
        student_name: row.student_name,
        id_number: row.id_number,
        gender: row.gender,
        status: row.attendance_status,
        attendance_date: row.attendance_date,
        created_at: row.attendance_created_at,
        updated_at: row.attendance_updated_at,
      });
    }
  }

  return Object.values(sessionsMap);
};
export const findSessionByIdAndDelete = async (session_id) => {
  const [result] = await db.execute(`DELETE FROM sessions WHERE id = ?`, [
    session_id,
  ]);
  return result.affectedRows > 0;
};
export const updateSession = async (
  session_id,
  { department, batch, section, session_date }
) => {
  const [result] = await db.execute(
    `UPDATE sessions SET department=?, batch=?, section=?, session_date=? WHERE id=?`,
    [department, batch, section, session_date, session_id]
  );
  return result.affectedRows > 0;
};
