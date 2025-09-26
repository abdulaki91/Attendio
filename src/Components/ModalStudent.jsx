import React from "react";

export default function ModalStudent({ student, onClose }) {
  if (!student) return null;

  const Field = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs text-base-content/60">{label}</span>
      <span className="font-medium">{value ?? "-"}</span>
    </div>
  );

  const initials = (student.fullname || "?")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <dialog id="view_student_modal" className="modal" open>
      <div className="modal-box max-w-2xl p-0 overflow-hidden">
        <div className="bg-gradient-to-r from-accent/30 via-accent/20 to-transparent px-6 py-4 border-b border-base-300/50 flex items-center justify-between">
          <h3 className="font-bold text-xl text-accent">Student Details</h3>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        <div className="p-6 space-y-5">
          <div className="flex items-center gap-4">
            <div className="avatar placeholder">
              <div className="bg-accent text-accent-content w-16 rounded-full">
                <span className="text-lg">{initials}</span>
              </div>
            </div>
            <div>
              <p className="text-lg font-semibold">{student.fullname}</p>
              <p className="text-sm text-base-content/70">ID: {student.id_number}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Department" value={student.department} />
            <Field label="Batch" value={student.batch} />
            <Field label="Year" value={student.year} />
            <Field label="Gender" value={student.gender} />
          </div>
        </div>

        <div className="px-6 py-3 border-t border-base-300/50 flex justify-end">
          <button type="button" className="btn" onClick={onClose}>Close</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}


