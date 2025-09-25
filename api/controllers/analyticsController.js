import { getAttendanceSummaryByDepartment } from "../models/analyticsModel.js";

export const fetchAttendanceSummary = async (req, res, next) => {
  try {
    const teacher_id = req.user?.id;
    const { date } = req.query;
    if (!teacher_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!date) {
      return res.status(400).json({ message: "Missing required 'date' (YYYY-MM-DD)" });
    }

    const summary = await getAttendanceSummaryByDepartment(teacher_id, date);
    return res.status(200).json({ data: summary });
  } catch (err) {
    next(err);
  }
};


