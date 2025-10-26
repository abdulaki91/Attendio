import { useState } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import toast from "react-hot-toast";
import useFetchResource from "../hooks/useFetchResource";
import useCreateResource from "../hooks/useCreateResource";

export default function AddStudentModal({ label }) {
  const [form, setForm] = useState({
    fullname: "",
    id_number: "",
    department: "",
    batch: "",
    section: "",
    gender: "",
  });

  const { data: departments = [] } = useFetchResource(
    "students/get-departments",
    "departments"
  );
  const { data: batches = [] } = useFetchResource(
    "students/get-batches",
    "batches"
  );
  const { data: sections = [] } = useFetchResource(
    "students/get-sections",
    "sections"
  );

  const { mutate: addStudent } = useCreateResource(
    "students/add-student",
    "students"
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        <div className="modal-box max-w-sm sm:max-w-lg md:max-w-2xl w-full p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-secondary/20 via-secondary/10 to-transparent px-4 sm:px-6 py-3 sm:py-4 border-b border-base-300/50 flex items-center justify-between">
            <h3 className="font-bold text-lg sm:text-xl md:text-2xl text-secondary">
              {label}
            </h3>
            <button
              type="button"
              className="btn btn-ghost btn-sm text-xl"
              onClick={() =>
                document.getElementById("add_student_modal").close()
              }
            >
              ✕
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm md:text-base"
          >
            <Input
              label="Full Name"
              placeholder="Enter full name"
              value={form.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
            />
            <Input
              label="ID Number"
              placeholder="Enter ID number"
              value={form.id_number}
              onChange={(e) => handleChange("id_number", e.target.value)}
            />
            <Select
              label="Department"
              className="w-full"
              placeholder="Select department"
              options={departments}
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
            <Select
              label="Section"
              className="w-full"
              placeholder="Select section"
              options={sections}
              value={form.section}
              onChange={(e) => handleChange("section", e.target.value)}
            />
            <Select
              label="Gender"
              className="w-full"
              placeholder="Select gender"
              options={["Male", "Female"]}
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
            <Select
              label="Batch"
              className="w-full"
              options={batches}
              placeholder="Select batch"
              value={form.batch}
              onChange={(e) => handleChange("batch", e.target.value)}
            />

            {/* Buttons row */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-base-300/50 col-span-1 sm:col-span-2">
              <button
                type="button"
                className="btn btn-outline btn-secondary w-full sm:w-auto"
                onClick={() =>
                  document.getElementById("add_student_modal").close()
                }
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
              >
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
