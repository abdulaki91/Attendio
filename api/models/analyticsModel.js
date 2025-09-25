import db from "../config/db.config.js";

// Returns [{ label, present, absent }], grouped by department for a teacher and date
export const getAttendanceSummaryByDepartment = async (teacher_id, date) => {
  // Compute present/absent counts per department for the specific teacher and date
  const sql = `
    SELECT
      s.department AS label,
      SUM(CASE WHEN a.status = 'Present' THEN 1 ELSE 0 END) AS present,
      SUM(CASE WHEN a.status = 'Absent' THEN 1 ELSE 0 END) AS absent
    FROM students s
    LEFT JOIN attendance a
      ON s.id = a.student_id
      AND a.teacher_id = ?
      AND a.attendance_date = ?
    WHERE s.teacher_id = ?
    GROUP BY s.department
    ORDER BY s.department ASC
  `;
  const [rows] = await db.execute(sql, [teacher_id, date, teacher_id]);
  return rows.map((r) => ({
    label: r.label || "Unknown",
    present: Number(r.present) || 0,
    absent: Number(r.absent) || 0,
  }));
};


