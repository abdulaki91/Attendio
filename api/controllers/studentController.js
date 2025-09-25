import {
  addStudentQuery,
  countStudents,
  createStudentsTable,
  deleteStudentQuery,
  fetchStudentsByTeacher,
  findStudentById,
  findStudentByIdNumber,
  getStudentsWithAttendance,
  updateStudentQuery,
} from "../models/studentModel.js";
import db from "../config/db.config.js";
export const initializeStudentTable = async (req, res, next) => {
  try {
    await createStudentsTable(); // Create table if it doesn't exist
    res.status(200).json({ message: "Students table is ready." });
  } catch (err) {
    next(err);
  }
};

export const getStudents = async (req, res) => {
  try {
    const teacher_id = req.user.id || null; // assuming auth middleware sets req.user
    const students = await fetchStudentsByTeacher(teacher_id);
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: err.message });
  }
};

export const addStudent = async (req, res) => {
  try {
    const { fullname, department, batch, year, gender, id_number } = req.body;

    // Validate required fields
    if (!fullname || !department || !gender || !id_number) {
      return res.status(400).json({
        message: "Fullname, department, gender, and ID number are required.",
      });
    }

    // Check if student with same id_number already exists
    const [existing] = await db.execute(
      "SELECT * FROM students WHERE id_number = ?",
      [id_number]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: `Student with ID "${id_number}" already exists.`,
      });
    }

    // Automatically assign teacher_id from logged-in user
    const teacher_id = req.user.id || null;

    const studentData = {
      fullname,
      department,
      batch: batch || null,
      year: year || null,
      gender,
      id_number,
      teacher_id,
    };

    await addStudentQuery(studentData);

    return res.status(201).json({
      message: "Student added successfully",
      student: studentData,
    });
  } catch (error) {
    console.error("Error adding student:", error);
    return res.status(500).json({
      message: "Failed to add student",
      error: error.message,
    });
  }
};
export const batchImportStudents = async (req, res, next) => {
  try {
    const students = req.body;
    const teacher_id = req.user?.id; // ✅ get teacher id from logged-in user

    if (!teacher_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "No students to import." });
    }

    const addedStudents = [];
    const skippedStudents = [];

    for (const s of students) {
      const {
        fullname,
        id_number,
        department,
        batch = null,
        year = null,
        gender,
      } = s;

      // Validate required fields
      if (!fullname || !id_number || !department || !gender) {
        skippedStudents.push({ ...s, reason: "Missing required field" });
        continue;
      }

      // Check if student already exists
      const existing = await findStudentByIdNumber(id_number);
      if (existing) {
        skippedStudents.push({ ...s, reason: "Duplicate ID" });
        continue;
      }

      // Add student with teacher_id
      await addStudentQuery({
        fullname,
        id_number,
        department,
        batch,
        year,
        gender,
        teacher_id, // ✅ attach teacher
      });

      addedStudents.push(s);
    }

    res.status(201).json({
      message: "Batch import completed.",
      added: addedStudents.length,
      skipped: skippedStudents,
      addedStudents,
    });
  } catch (err) {
    console.error("Batch import error:", err);
    next(err);
  }
};

export const fetchStudentsWithAttendance = async (req, res) => {
  try {
    // Read pagination params (default: page=1, limit=10)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Fetch paginated students
    const [rows] = await getStudentsWithAttendance(limit, offset);

    // Fetch total students for pagination metadata
    const [[{ total }]] = await countStudents();

    // Format attendance JSON
    const result = rows.map((row) => ({
      ...row,
      attendance_records: row.attendance_records
        ? JSON.parse(row.attendance_records)
        : [],
    }));

    res.status(200).json({
      data: result,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ message: "Failed to fetch student attendance" });
  }
};
// Add  dynamic field

// Edit student
export const editStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, department, batch, year, gender, id_number } = req.body;

    if (!fullname || !department || !id) {
      return res
        .status(400)
        .json({ message: "Fullname, department, and are required." });
    }

    const student = await findStudentById(id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    const updatedStudent = await updateStudentQuery({
      fullname,
      department,
      batch,
      year,
      gender,
      id_number,
    });

    res.status(200).json({
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update student.", error: err.message });
  }
};

/// DELETE /students/:id
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params; // use built-in id

    // Find the student by id
    const student = await findStudentById(id); // update this function to search by id
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Delete the student by id
    await deleteStudentQuery(id); // update this function to delete by id

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to delete student.", error: err.message });
  }
};
