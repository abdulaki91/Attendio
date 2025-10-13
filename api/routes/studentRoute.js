import {
  addStudent,
  batchImportStudents,
  deleteStudent,
  editStudent,
  getBatches,
  getDepartments,
  getSections,
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
// / Edit student by ID
router.put("/edit/:id", authenticateUser, editStudent);

// Delete student by ID
router.delete("/delete/:id", authenticateUser, deleteStudent);
router.get("/get-departments", authenticateUser, getDepartments);
router.get("/get-batches", authenticateUser, getBatches);
router.get("/get-sections", authenticateUser, getSections);

export default router;
