import { useEffect, useState } from "react";
import Select from "../Select";
import useFetchResource from "../../hooks/useFetchResource";
const formatDateForInput = (date) => {
  if (!date) return "";
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function SessionEditModal({ session, onClose }) {
  const [formData, setFormData] = useState(session || {});
  const { data: batches } = useFetchResource("students/get-batches", "batches");
  const { data: sections } = useFetchResource(
    "students/get-sections",
    "sections"
  );
  const { data: departments } = useFetchResource(
    "students/get-departments",
    "departments"
  );

  useEffect(() => {
    setFormData(session || {});
  }, [session]);

  if (!session) return null;

  // Unwrap the value from event object
  const handleChange = (field, eventOrValue) => {
    const value =
      eventOrValue && eventOrValue.target
        ? eventOrValue.target.value
        : eventOrValue;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new object to submit
    const newSessionData = {
      department: formData.department || session.department,
      batch: formData.batch || session.batch,
      section: formData.section || session.section,
      session_date: formData.date || session.date,
    };
  };

  return (
    <dialog className={`modal ${session ? "modal-open" : ""}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Edit Session</h3>

        <form onSubmit={handleSubmit} className="form-control space-y-3 mt-3">
          <div>
            <label className="label text-sm font-semibold">Department</label>
            <Select
              onChange={(val) => handleChange("department", val)}
              options={departments || []}
              value={formData.department || ""}
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">Batch</label>
            <Select
              onChange={(val) => handleChange("batch", val)}
              options={batches || []}
              value={formData.batch || ""}
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">Section</label>
            <Select
              onChange={(val) => handleChange("section", val)}
              options={sections || []}
              value={formData.section || ""}
            />
          </div>

          <div>
            <label className="label text-sm font-semibold">Date</label>
            <input
              type="date"
              value={formatDateForInput(formData.date)}
              onChange={(e) => handleChange("date", e)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
