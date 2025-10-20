import db from "../config/db.js";
export const createSession = async (req, res, next) => {
  try {
    const { department, batch, section, session_date } = req.body;

    const teacher_id = req.user.id;

    //  Check if session already exists
    const [existing] = await db.execute(
      `SELECT * FROM sessions WHERE teacher_id=? AND department=? AND batch=? AND section=? AND session_date=?`,
      [teacher_id, department, batch, section, session_date]
    );

    if (existing.length > 0) {
      return res
        .status(400)
        .json({ message: "Session already created. Please mark attendance." });
    }

    //  Insert session
    const [result] = await db.execute(
      `INSERT INTO sessions (teacher_id, department, batch, section, session_date)
       VALUES (?, ?, ?, ?, ?)`,
      [teacher_id, department, batch, section, session_date]
    );

    const session_id = result.insertId;

    //  Get all students in this department/batch/section
    const [students] = await db.execute(
      `SELECT id FROM students WHERE department=? AND batch=? AND section=?`,
      [department, batch, section]
    );

    //  Create attendance entries (all Absent by default)
    const insertPromises = students.map((s) =>
      db.execute(
        `INSERT INTO attendance (student_id, teacher_id, status, attendance_date)
         VALUES (?, ?, 'Absent', ?)`,
        [s.id, teacher_id, session_date]
      )
    );

    await Promise.all(insertPromises);

    res.status(201).json({
      message: "Session created and all students marked Absent.",
      session_id,
    });
  } catch (err) {
    next(err);
  }
};
