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
    year: "",
    gender: "",
  });

  const { mutate: addStudent } = useAddStudent();
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.fullname || !form.department || !form.id_number || !form.gender) {
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
          batch: "",
          year: "",
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
        <div className="modal-box">
          <h3 className="font-bold text-lg">{label}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Fixed fields */}
            <Input
              label="Fullname"
              placeholder="Enter full name"
              value={form.fullname}
              onChange={(e) => handleChange("fullname", e.target.value)}
            />
            <Input
              label="Department"
              placeholder="Enter department"
              value={form.department}
              onChange={(e) => handleChange("department", e.target.value)}
            />
            <Input
              label="ID Number"
              placeholder="Enter ID number"
              value={form.id_number}
              onChange={(e) => handleChange("id_number", e.target.value)}
            />
            <Input
              label="Batch"
              placeholder="Enter batch (optional)"
              value={form.batch}
              onChange={(e) => handleChange("batch", e.target.value)}
            />
            <Input
              label="Year"
              type="number"
              min={2000}
              value={form.year}
              onChange={(e) => handleChange("year", e.target.value)}
            />

            <Select
              label="Gender"
              options={["Male", "Female"]}
              value={form.gender}
              onChange={(value) => handleChange("gender", value)}
            />

            <div className="modal-action">
              <button
                type="button"
                className="btn"
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
      </dialog>
    </div>
  );
}
