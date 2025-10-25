import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import useDeleteResource from "../../hooks/useDeleteResource";
import SessionEditModal from "./SessionEditModal";

export default function SessionList({ sessions, selectedSessionId, onSelect }) {
  const [openMenuId, setOpenMenuId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [editSession, setEditSession] = useState(null);
  const deleteSession = useDeleteResource("session/delete-session", "sessions");

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".session-card")) setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConfirmDelete = () => {
    if (confirmId) {
      deleteSession.mutate(confirmId);
      setConfirmId(null);
      setOpenMenuId(null);
    }
  };
  return (
    <>
      {/* Delete confirmation modal */}
      {confirmId && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete this session?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleConfirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* Edit modal (from separate component) */}
      {editSession && <SessionEditModal session={editSession} />}

      {/* Session cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-80 overflow-y-auto border-[0.5px] p-2 rounded-lg shadow-sm bg-base-100 border-accent/20">
        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`session-card card shadow-md cursor-pointer border h-max transition-all relative hover:shadow-lg ${
              selectedSessionId === s.id
                ? "border-primary ring-2 ring-primary/30 bg-primary/10"
                : "border-amber-50 hover:bg-accent/10"
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMenu(s.id);
              }}
              className="absolute top-2 right-2 p-1 rounded hover:bg-base-300"
            >
              <MoreVertical size={20} />
            </button>

            {openMenuId === s.id && (
              <div className="absolute top-8 right-2 bg-base-100 border rounded-lg shadow-md w-32 z-50 flex flex-col divide-y divide-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditSession(s);
                  }}
                  className="btn btn-ghost btn-sm justify-start rounded-none px-4 py-2 hover:bg-base-300"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmId(s.id);
                  }}
                  className="btn btn-ghost btn-sm justify-start rounded-none px-4 py-2 text-red-600 hover:bg-base-300"
                >
                  Delete
                </button>
              </div>
            )}

            <div className="card-body">
              <h2 className="card-title capitalize">{s.subject}</h2>
              <p>Teacher: {s.teacherName || "N/A"}</p>
              <p>Date: {s.date}</p>
              <p>
                Class: {s.batch} - {s.section}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
