import _ from "lodash"; // optional, can use plain JS too
import db from "../config/db.config.js";

export const createAttendanceTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      teacher_id INT,  -- Who recorded the attendance
      status ENUM('Present', 'Absent', 'Late', 'Excused') NOT NULL DEFAULT 'Absent',
      attendance_date DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL,
      UNIQUE KEY unique_attendance (student_id, attendance_date)
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
  // ✅ Use attendance_date directly — it's already "YYYY-MM-DD"
  const formattedDate = attendance_date;

  // Check if attendance already exists
  const [rows] = await db.execute(
    `SELECT * FROM attendance WHERE student_id = ? AND attendance_date = ?`,
    [student_id, formattedDate]
  );

  if (rows.length > 0) {
    // Toggle status
    const currentStatus = rows[0].status;
    let newStatus = currentStatus === "Present" ? "Absent" : "Present";

    await db.execute(
      `UPDATE attendance SET status = ?, teacher_id = ? WHERE id = ?`,
      [newStatus, teacher_id, rows[0].id]
    );

    return `Attendance updated: ${newStatus}`;
  } else {
    // Insert new record
    await db.execute(
      `INSERT INTO attendance (student_id, teacher_id, status, attendance_date) 
       VALUES (?, ?, 'Present', ?)`,

      [student_id, teacher_id, formattedDate]
    );

    return "Attendance recorded: Present";
  }
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
  const { date, department, batch } = filters;
  let sql = `
  SELECT 
    s.id AS student_id,
    s.fullname,
    s.department,
    s.batch,
    s.year,
    s.id_number,
    s.gender,
    a.id AS attendance_id,
    a.status,
    DATE_FORMAT(a.attendance_date, '%Y-%m-%d') AS attendance_date,
    a.teacher_id
  FROM students s
  LEFT JOIN attendance a 
    ON s.id = a.student_id
`;

  const conditions = [];
  const params = [];

  // Filters for students
  if (department) {
    conditions.push("s.department = ?");
    params.push(department);
  }
  if (batch) {
    conditions.push("s.batch = ?");
    params.push(batch);
  }

  // Filters for attendance
  conditions.push("a.teacher_id = ?");
  params.push(teacher_id);

  if (date) {
    conditions.push("a.attendance_date = ?");
    params.push(date);
  }

  if (conditions.length > 0) {
    sql += " WHERE " + conditions.join(" AND ");
  }

  // Execute query
  const [rows] = await db.execute(sql, params);

  const studentsMap = {};

  rows.forEach((row) => {
    // Initialize student object if not exists
    if (!studentsMap[row.student_id]) {
      studentsMap[row.student_id] = {
        student_id: row.student_id,
        fullname: row.fullname,
        department: row.department,
        batch: row.batch,
        year: row.year,
        id_number: row.id_number,
        gender: row.gender,
        attendance: [],
      };
    }

    // Only process attendance if it exists and date is valid
    if (row.attendance_id && row.attendance_date) {
      studentsMap[row.student_id].attendance.push({
        status: row.status,
        attendance_date: row.attendance_date, // already YYYY-MM-DD
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
