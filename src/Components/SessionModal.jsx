import { useState, useEffect } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";

export default function SessionModal({
  onClose,
  onSubmit,
  sections,
  batches,
  departments,
  selectedDepartment,
  selectedBatch,
  selectedSection,
  setSelectedDepartment,
  setSelectedBatch,
  setSelectedSection,
}) {
  const [sessionDate, setSessionDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // ✅ Keep the modal fields synced with parent selections
  useEffect(() => {
    setSelectedDepartment((prev) => prev || "");
    setSelectedBatch((prev) => prev || "");
    setSelectedSection((prev) => prev || "");
  }, [setSelectedDepartment, setSelectedBatch, setSelectedSection]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !sessionDate ||
      !selectedDepartment ||
      !selectedBatch ||
      !selectedSection
    ) {
      alert("Please fill all fields!");
      return;
    }

    //  Send data to parent
    onSubmit({
      session_date: sessionDate,
      department: selectedDepartment,
      batch: selectedBatch,
      section: selectedSection,
    });

    onClose();
  };

  return (
    <dialog id="session_modal" className="modal" open>
      <div className="modal-box w-max p-0 overflow-hidden rounded-lg shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent px-6 py-4 border-b border-base-300/50 flex items-center justify-between">
          <h3 className="font-bold text-2xl text-primary">Start Session</h3>
          <button
            type="button"
            className="btn btn-ghost btn-sm text-xl"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />

            <Select
              label="Department"
              value={selectedDepartment}
              options={departments}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setSelectedBatch("");
                setSelectedSection("");
              }}
            />

            <Select
              label="Batch"
              value={selectedBatch}
              options={batches}
              onChange={(e) => {
                setSelectedBatch(e.target.value);
                setSelectedSection("");
              }}
              disabled={!selectedDepartment}
            />

            <Select
              label="Section"
              value={selectedSection}
              options={sections}
              onChange={(e) => setSelectedSection(e.target.value)}
              disabled={!selectedBatch}
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
            <button type="submit" className="btn btn-primary w-full sm:w-auto">
              Start Session
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
