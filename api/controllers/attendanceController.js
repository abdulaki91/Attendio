import {
  createAttendanceTable,
  getAllStudents,
  getStudentsByStatus,
  getStudentsWithAttendance,
  toggleAttendanceRecord,
} from "../models/attendanceModel.js";

export const initializeAttendanceTable = async (req, res, next) => {
  try {
    await createAttendanceTable(); // Create table if it doesn't exist
    res.status(200).json({ message: "Attendance table is ready." });
  } catch (err) {
    next(err);
  }
};

// Controller
export const markAttendance = async (req, res, next) => {

  try {
    const { student_id, attendance_date } = req.body;

    // Teacher comes from authenticated user
    const teacher_id = req.user?.id;

    const message = await toggleAttendanceRecord({
      student_id,
      attendance_date,
      teacher_id,
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
// Students with attendance status for a specific date (and optional filters)
export const fetchStudentsWithAttendance = async (req, res, next) => {
  try {
    const teacher_id = req.user.id; // logged-in teacher
    const { date, department, batch } = req.query;
    const students = await getStudentsWithAttendance(teacher_id, {
      date,
      department,
      batch,
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
