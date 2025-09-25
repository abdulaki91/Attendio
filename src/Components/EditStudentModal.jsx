import { useState, useEffect } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import { useEditStudent } from "../hooks/UseEditStudent";

export default function EditStudentModal({ student, onClose }) {
  const [form, setForm] = useState({});
  const editStudent = useEditStudent();

  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editStudent.mutate(form, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  if (!student) return null;

  return (
    <dialog id="edit_student_modal" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-3">Edit Student</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            label="ID Number"
            value={form.id_number || ""}
            onChange={(e) => handleChange("id_number", e.target.value)}
          />

          <Input
            label="Full Name"
            value={form.fullname || ""}
            onChange={(e) => handleChange("fullname", e.target.value)}
          />

          <Input
            label="Department"
            value={form.department || ""}
            onChange={(e) => handleChange("department", e.target.value)}
          />

          <Select
            label="Batch"
            value={form.batch || ""}
            options={["Batch I", "Batch II"]}
            onChange={(e) => handleChange("batch", e.target.value)}
          />

          <Input
            label="Year"
            value={form.year || ""}
            onChange={(e) => handleChange("year", e.target.value)}
          />

          <Select
            label="Gender"
            value={form.gender || ""}
            options={["Male", "Female"]}
            onChange={(e) => handleChange("gender", e.target.value)}
          />

          <div className="modal-action flex justify-end space-x-2 mt-3">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={editStudent.isLoading}
            >
              {editStudent.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
