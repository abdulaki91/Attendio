export default function SessionList({ sessions, selectedSessionId, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {sessions.map((s) => (
        <div
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`card shadow-md cursor-pointer border transition-all hover:shadow-lg ${
            selectedSessionId === s.id
              ? "border-primary ring-2 ring-primary/30 bg-primary/10"
              : "border-gray-200"
          }`}
        >
          <div className="card-body">
            <h2 className="card-title capitalize">{s.subject}</h2>
            <p>Teacher: {s.teacherName || "N/A"}</p> {/* access name */}
            <p>Date: {s.date}</p>
            <p>
              Class: {s.batch} - {s.section}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
