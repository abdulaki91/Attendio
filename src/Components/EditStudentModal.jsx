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
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent px-6 py-4 border-b border-base-300/50 flex items-center justify-between">
          <h3 className="font-bold text-xl text-primary">Edit Student</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="w-full">
              <Input
                label="Full Name"
                value={form.fullname || ""}
                onChange={(e) => handleChange("fullname", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                label="ID Number"
                value={form.id_number || ""}
                onChange={(e) => handleChange("id_number", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                label="Department"
                value={form.department || ""}
                onChange={(e) => handleChange("department", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Select
                label="Batch"
                value={form.batch || ""}
                options={["Batch I", "Batch II"]}
                onChange={(e) => handleChange("batch", e.target.value)}
              />
            </div>
            <div className="w-full">
              <Input
                label="Year"
                value={form.year || ""}
                onChange={(e) => handleChange("year", e.target.value)}
              />
            </div>
            <div className="w-full col-span-2">
              <Select
                placeholder="Select gender"
                value={form.gender || ""}
                options={["Male", "Female"]}
                onChange={(e) => handleChange("gender", e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-base-300/50">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={editStudent.isLoading}
            >
              {editStudent.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
