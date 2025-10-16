import { useState } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import toast from "react-hot-toast";
import { useAddStudent } from "../hooks/useAddStudent";

export default function AddStudentModal({ label }) {
  const [form, setForm] = useState({
    fullname: "",
    id_number: "",
    department: "",
    batch: "",
    section: "",
    gender: "",
  });

  const { mutate: addStudent } = useAddStudent();
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !form.fullname ||
      !form.department ||
      !form.id_number ||
      !form.gender ||
      !form.section
    ) {
      toast.error(
        "Please fill all required fields (Fullname, ID number, Department, Gender)"
      );
      return;
    }

    addStudent(form, {
      onSuccess: () => {
        setForm({
          fullname: "",
          id_number: "",
          department: "",
          section: "",
          batch: "",
          gender: "",
        });
        const modal = document.getElementById("add_student_modal");
        if (modal) modal.close();
      },
    });
  };

  return (
    <div>
      <dialog id="add_student_modal" className="modal">
        <div className="modal-box w-max p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-secondary/20 via-secondary/10 to-transparent px-6 py-4 border-b border-base-300/50 flex items-center justify-between">
            <h3 className="font-bold text-xl text-secondary">{label}</h3>
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() =>
                document.getElementById("add_student_modal").close()
              }
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <Input
              placeholder="Enter full name"
              value={form.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
            />
            <Input
              placeholder="Enter ID number"
              value={form.id_number}
              onChange={(e) => handleChange("id_number", e.target.value)}
            />
            <Input
              placeholder="Enter department"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
            <Input
              placeholder="Enter section (optinal)"
              value={form.section}
              onChange={(e) => handleChange("section", e.target.value)}
            />
            <Select
              className="w-full"
              placeholder="Select gender"
              options={["Male", "Female", "Other"]}
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
            <Input
              placeholder="Enter batch (optional)"
              value={form.batch}
              onChange={(e) => handleChange("batch", e.target.value)}
            />

            {/* Buttons row */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-base-300/50 col-span-1 md:col-span-2">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() =>
                  document.getElementById("add_student_modal").close()
                }
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
