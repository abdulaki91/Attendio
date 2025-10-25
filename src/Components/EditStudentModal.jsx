import { useState, useEffect } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import useFetchResource from "../hooks/useFetchResource";
import useEditResource from "../hooks/useEditResource";
export default function EditStudentModal({ student, onClose }) {
  const [form, setForm] = useState({});
  const editStudent = useEditResource("students/edit", "students");
  const { data: sections = [] } = useFetchResource(
    "students/get-sections",
    "sections"
  );
  const { data: departments = [] } = useFetchResource(
    "students/get-departments",
    "departments"
  );
  const { data: batch = [] } = useFetchResource(
    "students/get-batches",
    "batches"
  );
  useEffect(() => {
    if (student) setForm(student);
  }, [student]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    editStudent.mutate(form, {
      onSuccess: () => onClose(),
    });
  };

  if (!student) return null;

  return (
    <dialog id="edit_student_modal" className="modal" open>
      <div className="modal-box w-max p-0 overflow-hidden rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-4 border-b border-base-300/50 flex items-center justify-between">
          <h3 className="font-bold text-2xl text-primary">Edit Student</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 w-max">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 justify-center items-center w-max">
            <Input
              placeholder="Full Name"
              value={form.fullname || ""}
              onChange={(e) => handleChange("fullname", e.target.value)}
            />
            <Input
              placeholder="ID Number"
              value={form.id_number || ""}
              onChange={(e) => handleChange("id_number", e.target.value)}
            />
            <Select
              label="Department"
              value={form.department || ""}
              options={departments}
              onChange={(e) => handleChange("department", e.target.value)}
            />

            <Select
              label="Batch"
              value={form.batch || ""}
              options={batch}
              onChange={(e) => handleChange("batch", e.target.value)}
            />
            <Select
              label="Section"
              options={sections}
              value={form.section || ""}
              onChange={(e) => handleChange("section", e.target.value)}
            />
            <Select
              label="Gender"
              value={form.gender || ""}
              options={["Male", "Female"]}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-base-300/50">
            <button
              type="button"
              className="btn btn-outline btn-secondary w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary w-full sm:w-auto"
              disabled={editStudent.isLoading}
            >
              {editStudent.isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>

      {/* Modal backdrop */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
