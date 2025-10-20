import {
  createAttendanceTable,
  getAllStudents,
  getStudentsByStatus,
  getStudentsWithAttendance,
  toggleAttendanceRecord,
  getMissedAttendanceById,
  getMissedAttendance,
  findAttendanceRecord,
  insertDefaultAttendance,
} from "../models/attendanceModel.js";
import { findSessionByTeacherAndDate } from "../models/sessionModel.js";

export const initializeAttendanceTable = async (req, res, next) => {
  try {
    await createAttendanceTable(); // Create table if it doesn't exist
    res.status(200).json({ message: "Attendance table is ready." });
  } catch (err) {
    next(err);
  }
};

export const markAttendance = async (req, res, next) => {
  try {
    const { student_id, attendance_date } = req.body;
    const teacher_id = req.user?.id;

    // 🔸 Step 1: Validate input
    if (!teacher_id || !attendance_date || !student_id) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // 🔸 Step 2: Check if session exists
    const sessionRows = await findSessionByTeacherAndDate(
      teacher_id,
      attendance_date
    );
    const session_id = sessionRows.length > 0 ? sessionRows[0].id : null;

    if (sessionRows.length === 0) {
      return res.status(400).json({
        message: "Cannot mark attendance. Please start session first.",
      });
    }

    // 🔸 Step 3: Ensure record exists or create default
    const attendanceRows = await findAttendanceRecord(
      student_id,
      teacher_id,
      attendance_date
    );

    if (attendanceRows.length === 0) {
      await insertDefaultAttendance(
        student_id,
        teacher_id,
        attendance_date,
        session_id
      );
    }

    // 🔸 Step 4: Toggle attendance
    const message = await toggleAttendanceRecord({
      student_id,
      teacher_id,
      attendance_date,
    });

    return res.status(200).json({ message });
  } catch (err) {
    console.error("Error marking attendance:", err);
    next(err);
  }
};

// Students with attendance status for a specific date (and optional filters)
export const fetchStudentsWithAttendance = async (req, res, next) => {
  try {
    const teacher_id = req.user.id; // logged-in teacher
    const { date, department, batch, section } = req.query;
    const students = await getStudentsWithAttendance(teacher_id, {
      date,
      department,
      batch,
      section,
    });

    if (!students || students.length === 0) {
      return res.status(404).json({
        students: [],
        message: "No attendance records found.",
      });
    }

    res.status(200).json({ students });
  } catch (err) {
    console.error("Error fetching students with attendance:", err);
    next(err); // or res.status(500).json({ message: "Server error" })
  }
};

// Present students (date optional)
export const fetchPresentStudents = async (req, res, next) => {
  try {
    const { date } = req.query; // optional
    const students = await getStudentsByStatus("Present", date);
    res.json(students);
  } catch (err) {
    next(err);
  }
};
// All students grouped into present & absent
export const fetchAttendance = async (req, res, next) => {
  try {
    const { date, department, batch } = req.query;

    // 1. Get all students (optionally filter by grade)
    let allStudents = await getAllStudents();
    if (department)
      allStudents = allStudents.filter((s) => s.department === department);
    if (batch) allStudents = allStudents.filter((s) => s.batch === batch);

    // 2. Get present students for that date
    const presentStudents = await getStudentsByStatus("Present", date);

    // 3. Compute absent students
    const absentStudents = allStudents.filter(
      (student) =>
        !presentStudents.some((p) => p.id_number === student.id_number)
    );

    // 4. Return grouped result
    res.json({
      total: allStudents.length,
      present: presentStudents,
      absent: absentStudents,
    });
  } catch (err) {
    next(err);
  }
};

// Missed counts per student (number of Absent) with optional filters/date range

// 🔹 Get missed attendance for all students
export const fetchAllMissedAttendance = async (req, res) => {
  try {
    const data = await getMissedAttendance();
    res.json(data);
  } catch (err) {
    console.error("Error fetching missed attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// 🔹 Get missed attendance for one student
export const fetchMissedAttendanceById = async (req, res) => {
  const { studentId } = req.params;
  try {
    const data = await getMissedAttendanceById(studentId);
    res.json(data);
  } catch (err) {
    console.error("Error fetching student attendance:", err);
    res.status(500).json({ error: "Server error" });
  }
};
