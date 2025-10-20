import { insertDefaultAttendance } from "../models/attendanceModel.js";
import { findExistingSession, insertSession } from "../models/sessionModel.js";
import { findStudentsByDepartmentBatchSection } from "../models/studentModel.js";

export const createSession = async (req, res, next) => {
  try {
    const { department, batch, section, session_date } = req.body;
    const teacher_id = req.user.id;

    // Check if session exists
    const existing = await findExistingSession(
      teacher_id,
      department,
      batch,
      section,
      session_date
    );
    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Session already created. Please mark attendance." });
    }

    // Create session
    const session_id = await insertSession(
      teacher_id,
      department,
      batch,
      section,
      session_date
    );

    // Fetch students
    const students = await findStudentsByDepartmentBatchSection(
      department,
      batch,
      section
    );

    // Insert default 'Absent' attendance
    await insertDefaultAttendance(
      students,
      teacher_id,
      session_date,
      session_id
    );

    res.status(201).json({
      message: "Session created and all students marked Absent.",
      session_id,
    });
  } catch (err) {
    next(err);
  }
};
