import {
  addStudent,
  batchImportStudents,
  deleteStudent,
  editStudent,
  fetchStudentsWithAttendance,
  getStudents,
  initializeStudentTable,
} from "../controllers/studentController.js";
import express from "express";
import { authenticateUser } from "../middlware/authMiddleware.js";
const router = express.Router();

router.get("/initialize/create-student-table", initializeStudentTable);
router.get("/get-students", authenticateUser, getStudents);
router.post("/add-student", authenticateUser, addStudent);
router.post("/batch-import", authenticateUser, batchImportStudents);
router.get(
  "/student-attendances",
  authenticateUser,
  fetchStudentsWithAttendance
);
// / Edit student by ID
router.put("/edit/:id", authenticateUser, editStudent);

// Delete student by ID
router.delete("/delete/:id", authenticateUser, deleteStudent);

export default router;
