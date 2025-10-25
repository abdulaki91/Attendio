export default function StudentModal({ student, onClose }) {
  if (!student) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{student.name}</h3>
        <p>Department: {student.department}</p>
        <p>Department: {student.department}</p>
        <p>Status: {student.status}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
