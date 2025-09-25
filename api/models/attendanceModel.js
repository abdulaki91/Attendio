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
      UNIQUE KEY unique_attendance_teacher (student_id, attendance_date, teacher_id)
    );
  `;
  // Try to ensure the unique key is (student_id, attendance_date, teacher_id)
  // In case an older index exists, adjust it safely.
  return db
    .execute(sql)
    .then(async () => {
      try {
        await db.execute(
          `ALTER TABLE attendance DROP INDEX unique_attendance;`
        );
      } catch (e) {
        // index may not exist; ignore
      }
      try {
        await db.execute(
          `ALTER TABLE attendance ADD UNIQUE KEY unique_attendance_teacher (student_id, attendance_date, teacher_id);`
        );
      } catch (e) {
        // already updated; ignore
      }
    });
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
    `SELECT * FROM attendance WHERE student_id = ? AND attendance_date = ? AND teacher_id = ?`,
    [student_id, formattedDate, teacher_id]
  );

  if (rows.length > 0) {
    // Toggle status
    const currentStatus = rows[0].status;
    let newStatus = currentStatus === "Present" ? "Absent" : "Present";

    await db.execute(
      `UPDATE attendance SET status = ? WHERE id = ?`,
      [newStatus, rows[0].id]
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
  console.log("teacher_id", teacher_id);
  console.log("date", date);
  console.log("department", department);
  console.log("batch", batch);

  // Build SQL in parts to keep placeholder ordering predictable
  let selectClause = `
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
    a.teacher_id`;

  let fromClause = `
  FROM students s`;

  // LEFT JOIN must include attendance filters to avoid converting to INNER JOIN
  let joinClause = `
  LEFT JOIN attendance a ON s.id = a.student_id`;

  const params = [];

  // Attendance filters go on the JOIN so students without attendance are kept
  if (teacher_id !== undefined && teacher_id !== null) {
    joinClause += ` AND a.teacher_id = ?`;
    params.push(teacher_id);
  }
  if (date) {
    joinClause += ` AND a.attendance_date = ?`;
    params.push(date);
  }

  const whereConditions = [];

  // Student attribute filters belong in WHERE
  if (department) {
    whereConditions.push("s.department = ?");
    params.push(department);
  }
  if (batch) {
    whereConditions.push("s.batch = ?");
    params.push(batch);
  }

  let sql = selectClause + fromClause + joinClause;
  if (whereConditions.length > 0) {
    sql += "\n  WHERE " + whereConditions.join(" AND ");
  }

  const [rows] = await db.execute(sql, params);

  const studentsMap = {};

  rows.forEach((row) => {
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
