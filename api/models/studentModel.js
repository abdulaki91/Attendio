import db from "../config/db.config.js";
export const createStudentsTable = () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      fullname VARCHAR(255) NOT NULL,
      department VARCHAR(100) NOT NULL,
      batch VARCHAR(50),
      year VARCHAR(50),
      id_number VARCHAR(100) UNIQUE,
      gender ENUM('Male','Female','Other') NOT NULL,
      teacher_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `;
  return db.execute(sql);
};

// models/studentModel.js
export const fetchStudentsByTeacher = async (teacher_id) => {
  // Get all columns except created_at
  const [columns] = await db.query(`
    SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = 'students'
      AND COLUMN_NAME != 'created_at';
  `);

  const columnNames = columns.map((c) => c.COLUMN_NAME).join(", ");

  // Fetch students only for this teacher
  const [rows] = await db.query(
    `SELECT ${columnNames} FROM students WHERE teacher_id = ?`,
    [teacher_id]
  );

  return rows;
};

export const addStudentQuery = async (studentData) => {
  const {
    fullname,
    department,
    batch = null,
    year = null,
    gender,
    teacher_id = null,
    id_number,
  } = studentData;

  if (!id_number) {
    const error = new Error("ID number is required.");
    error.code = "MISSING_ID";
    throw error;
  }

  // Check if student with the same id_number already exists
  const [existing] = await db.execute(
    "SELECT * FROM students WHERE id_number = ?",
    [id_number]
  );

  if (existing.length > 0) {
    const error = new Error(`Student with ID "${id_number}" already exists.`);
    error.code = "DUPLICATE_ID";
    throw error;
  }

  // Insert student
  const sql = `
    INSERT INTO students (fullname, department, batch, year, gender, teacher_id, id_number)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    fullname,
    department,
    batch,
    year,
    gender,
    teacher_id,
    id_number,
  ];

  const [result] = await db.execute(sql, values);

  // Return inserted student with id
  return {
    id: result.insertId,
    fullname,
    department,
    batch,
    year,
    gender,
    teacher_id,
    id_number,
  };
};

export const getStudentsWithAttendance = (limit, offset) => {
  const sql = `
    SELECT 
      s.id AS student_id,
      s.fullname,
      s.grade,
      CONCAT('[', 
        GROUP_CONCAT(
          CONCAT(
            '{',
            '"attendance_id":', a.id,
            ',"status":"', a.status, '"',
            ',"date":"', a.attendance_date, '"',
            ',"day":"', a.day, '"',
            ',"created_at":"', a.created_at, '"',
            '}'
          )
        ),
      ']') AS attendance_records
    FROM students s
    LEFT JOIN attendance a ON s.id = a.student_id
    GROUP BY s.id, s.name, s.grade
    ORDER BY s.id ASC
    LIMIT ? OFFSET ?;
  `;
  return db.execute(sql, [limit, offset]);
};

export const countStudents = () => {
  const sql = `SELECT COUNT(*) AS total FROM students;`;
  return db.execute(sql);
};

// Find student by ID number
export const findStudentById = async (id) => {
  const [rows] = await db.execute("SELECT * FROM students WHERE id = ?", [id]);
  return rows[0] || null;
};

// Update student
export const updateStudentQuery = async ({
  fullname,
  department,
  batch = null,
  year = null,
  gender,
  id_number,
}) => {
  const sql = `
    UPDATE students 
    SET fullname = ?, department = ?, batch = ?, year = ?, gender = ?
    WHERE id_number = ?
  `;
  const values = [fullname, department, batch, year, gender, id_number];
  await db.execute(sql, values);

  // Return updated student
  return findStudentById(id_number);
};

// Delete student
export const deleteStudentQuery = async (id) => {
  const sql = "DELETE FROM students WHERE id = ?";
  await db.execute(sql, [id]);
};
