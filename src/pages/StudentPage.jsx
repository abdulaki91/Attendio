import { useEffect, useState } from "react";
import SearchInput from "../Components/SearchInput";
import Table from "../Components/Table";
import AddStudentModal from "../Components/AddStudentModal";
import EditStudentModal from "../Components/EditStudentModal";
import ConfirmDialog from "../Components/ConfirmDialogue";
import CSVPreview from "../pages/CSVPreview";
import useFetchResource from "../hooks/useFetchResource";
import useCreateResource from "../hooks/useCreateResource";
import useEditResource from "../hooks/useEditResource";
import useDeleteResource from "../hooks/useDeleteResource";
import { useFileUpload } from "../hooks/useFileUpload";

export default function Student() {
  // --- Local State ---
  const [localStudents, setLocalStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const { csvData, setCsvData, handleFileUpload } = useFileUpload();

  // --- Hooks for CRUD ---
  const { data: students = [], isLoading } = useFetchResource(
    "students/get-students",
    "students"
  );
  const { mutate: createStudent } = useCreateResource(
    "students/create-student",
    "students"
  );

  const { mutate: editStudent } = useEditResource(
    "students/edit-student",
    "students"
  );

  const { mutate: deleteStudent } = useDeleteResource(
    "students/delete",
    "students"
  );

  // --- Sync fetched data with local state ---
  useEffect(() => {
    setLocalStudents(students);
  }, [students]);

  // --- Filtered Students ---
  const filteredStudents = localStudents.filter(
    (student) =>
      (student.fullname || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (student.id_number || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (student.department || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      (student.section || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Handlers ---
  const handleEditStudent = (student) => setEditingStudent(student);

  const handleStudentUpdated = (updatedStudent) => {
    editStudent(updatedStudent, {
      onSuccess: () => {
        setLocalStudents((prev) =>
          prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        setEditingStudent(null);
      },
    });
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setConfirmDelete(true);
  };

  const confirmDeleteStudent = () => {
    deleteStudent(studentToDelete.id, {
      onSuccess: () => {
        setLocalStudents((prev) =>
          prev.filter((s) => s.id !== studentToDelete.id)
        );
        setConfirmDelete(false);
        setStudentToDelete(null);
      },
    });
  };

  const handleStudentAdded = (newStudent) => {
    createStudent(newStudent, {
      onSuccess: (data) => {
        setLocalStudents((prev) => [...prev, data]);
      },
    });
  };

  // --- Loading state ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner">Loading...</span>
      </div>
    );
  }

  // --- Render ---
  return (
    <div className="flex flex-col h-screen bg-base-100">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 py-3 border-b">
        <h1 className="font-bold text-lg md:text-xl">Students</h1>

        <div className="flex flex-wrap gap-2">
          <div className="px-3 py-2 bg-base-200 rounded-md">
            <p className="text-sm md:text-base">
              Results: {filteredStudents.length}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={() =>
              document.getElementById("add_student_modal").showModal()
            }
          >
            Add New Student
          </button>

          <AddStudentModal
            label="Add New Student"
            onStudentAdded={handleStudentAdded}
          />

          <label className="btn btn-outline cursor-pointer">
            Import File (Excel, CSV, XLSX)
            <input
              type="file"
              accept=".csv, .xlsx, .xls"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      </div>

      {/* CSV Preview */}
      {csvData.length > 0 && (
        <CSVPreview
          onClose={() => setCsvData([])}
          csvData={csvData}
          fetchedStudents={localStudents}
          onImportSuccess={(added) =>
            setLocalStudents((prev) => [...prev, ...added])
          }
        />
      )}

      {/* Search */}
      <div className="px-4 py-3">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, ID, or department"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-md border">
        <Table
          data={filteredStudents}
          onEdit={handleEditStudent}
          onDelete={handleDeleteStudent}
        />
      </div>

      {/* Edit Modal */}
      {editingStudent && (
        <EditStudentModal
          student={editingStudent}
          onClose={() => setEditingStudent(null)}
          onUpdate={handleStudentUpdated}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <ConfirmDialog
          isOpen={confirmDelete}
          title="Delete Student"
          message={`Are you sure you want to delete "${studentToDelete.fullname}"?`}
          onConfirm={confirmDeleteStudent}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}
