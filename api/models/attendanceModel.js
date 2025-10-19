import _ from "lodash"; // optional, can use plain JS too
import db from "../config/db.config.js";

export const createAttendanceTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT,  -- Who recorded the attendance
      status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL DEFAULT 'Absent',
      attendance_date DATE NOT NULL,
      session_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
      UNIQUE KEY unique_attendance_teacher (student_id, attendance_date, teacher_id)
    );
  `;

  // In case an older index exists, adjust it safely.
  return db.execute(sql).then(async () => {
    try {
      await db.execute(
        `ALTER TABLE attendance ADD UNIQUE KEY unique_attendance_teacher (student_id, attendance_date, teacher_id);`
      );
    } catch (e) {
      // already updated; ignore
      console.log(
        "Unique key likely already exists, skipping alteration.",
        e.message
      );
    }
  });
};
// create Session table

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

// Toggle attendance record (date-based only)
export const toggleAttendanceRecord = async ({
  student_id,
  attendance_date,
  teacher_id,
}) => {
  const [rows] = await db.execute(
    `SELECT * FROM attendance WHERE student_id=? AND attendance_date=? AND teacher_id=?`,
    [student_id, attendance_date, teacher_id]
  );

  if (rows.length === 0) {
    throw new Error(
      "Attendance record not found — please create a session first."
    );
  }

  const currentStatus = rows[0].status;
  const newStatus = currentStatus === "Present" ? "Absent" : "Present";

  await db.execute(`UPDATE attendance SET status=? WHERE id=?`, [
    newStatus,
    rows[0].id,
  ]);

  return `Attendance updated: ${newStatus}`;
};

// Fetch attendance by exact date
export const fetchAttendanceByDate = async (date) => {
  const sql = "SELECT * FROM attendance WHERE attendance_date = ?;";
  const [rows] = await db.query(sql, [date]);
  return rows;
};

// Fetch attendance by student ID
export const fetchAttendanceByStudentId = async (studentId) => {
  const sql = `
    SELECT a.*, s.grade
    FROM attendance a
    INNER JOIN students s ON a.student_id = s.id
    WHERE a.student_id = ?;
  `;
  const [rows] = await db.query(sql, [studentId]);
  return rows;
};
// Fetch students with their attendance for the logged-in teacher
export const getStudentsWithAttendance = async (teacher_id, filters = {}) => {
  const { date, department, batch, section } = filters;

  if (!teacher_id) {
    throw new Error("teacher_id is required");
  }

  // --- Base SELECT ---
  let sql = `
  SELECT 
    s.id ,
    s.fullname,
    s.department,
    s.batch,
    s.section,
    s.teacher_id ,
    s.id_number,
    s.gender,
    a.id AS attendance_id,
    a.student_id,
    a.teacher_id,
    a.status,
DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS attendance_date
  FROM students s
  Left JOIN attendance a ON s.id = a.student_id
`;

  const params = [teacher_id];

  // --- Filter by date if provided ---
  if (date) {
    sql += ` AND a.attendance_date = ?`;
    params.push(date);
  }

  // --- WHERE filters (student-level) ---
  const whereConditions = [];
  if (teacher_id) {
    whereConditions.push("s.teacher_id= ?");
  }
  if (department) {
    whereConditions.push("s.department = ?");
    params.push(department);
  }
  if (batch) {
    whereConditions.push("s.batch = ?");
    params.push(batch);
  }
  if (section) {
    whereConditions.push("s.section = ?");
    params.push(section);
  }
  if (whereConditions.length > 0) {
    sql += `\nWHERE ${whereConditions.join(" AND ")}`;
  }

  // --- Execute Query ---
  const [rows] = await db.execute(sql, params);

  // --- Structure output ---
  const studentsMap = {};

  rows.forEach((row) => {
    if (!studentsMap[row.id]) {
      studentsMap[row.id] = {
        id: row.id,
        fullname: row.fullname,
        department: row.department,
        batch: row.batch,
        section: row.section,
        teacher_id: row.teacher_id,
        id_number: row.id_number,
        gender: row.gender,
        attendance: [],
      };
    }

    if (row.attendance_id && row.attendance_date) {
      studentsMap[row.student_id].attendance.push({
        status: row.status,
        attendance_date: row.attendance_date,
        teacher_id: row.teacher_id,
      });
    }
  });

  return Object.values(studentsMap);
};

// Fetch students by status (Present / Absent)
export const getStudentsByStatus = async (status, date) => {
  let sql = `
    SELECT *
    FROM students s
    JOIN attendance a ON s.id = a.student_id
    WHERE a.status = ?
  `;
  const params = [status];

  if (date) {
    sql += ` AND a.attendance_date = ?`;
    params.push(date);
  }

  const [rows] = await db.execute(sql, params);
  return rows;
};

// Fetch attendance by date and grade
export const getAttendance = async (date, grade) => {
  let sql = `
    SELECT s.id, s.fullname, s.grade, a.status, a.attendance_date
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id
    WHERE 1=1
  `;

  const params = [];

  if (date) {
    sql += " AND a.attendance_date = ?";
    params.push(date);
  }

  if (grade) {
    sql += " AND s.grade = ?";
    params.push(grade);
  }

  sql += " ORDER BY s.fullname ASC";

  const [rows] = await db.execute(sql, params);
  return rows;
};

export const getAllStudents = async () => {
  const sql = "SELECT * FROM students;";
  const [rows] = await db.execute(sql);
  return rows;
};
// / 🔹 Get total missed attendances per student
export const getMissedAttendance = async () => {
  const [rows] = await db.execute(`
    SELECT 
      s.id AS student_id,
      s.fullname AS student_name,
      COUNT(*) AS missed_count
    FROM attendance a
    JOIN students s ON s.id = a.student_id
    WHERE a.status = 'Absent'
    GROUP BY s.id, s.fullname
  `);
  return rows;
};
// 🔹 Get missed attendance for a single student
export const getMissedAttendanceById = async (studentId) => {
  const [rows] = await db.execute(
    `
    SELECT 
      s.id AS student_id,
      s.fullname AS student_name,
      COUNT(*) AS missed_count
    FROM attendance a
    JOIN students s ON s.id = a.student_id
    WHERE a.status = 'Absent' AND s.id = ?
    GROUP BY s.id, s.fullname
    `,
    [studentId]
  );
  return (
    rows[0] || { student_id: studentId, student_name: null, missed_count: 0 }
  );
};
