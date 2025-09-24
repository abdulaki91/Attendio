// Components/ConfirmDialog.jsx
import React from "react";

export default function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message = "Do you really want to proceed?",
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-error" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
