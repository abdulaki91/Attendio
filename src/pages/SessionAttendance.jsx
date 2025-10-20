// src/pages/SessionAttendance.jsx
import { useState } from "react";

export default function SessionAttendance() {
  // Static list of sessions
  const [sessions] = useState([
    {
      id: 1,
      subject: "Math",
      teacher: "Mr. Ali",
      date: "2025-10-20",
      batch: "Batch A",
      section: "Section 1",
    },
    {
      id: 2,
      subject: "Physics",
      teacher: "Ms. Fatuma",
      date: "2025-10-21",
      batch: "Batch A",
      section: "Section 1",
    },
    {
      id: 3,
      subject: "Chemistry",
      teacher: "Mr. Hassan",
      date: "2025-10-22",
      batch: "Batch B",
      section: "Section 2",
    },
  ]);

  // Static attendance for each session
  const attendanceData = {
    1: [
      {
        student_id: 1,
        student_name: "Ali",
        department: "Science",
        status: "Present",
        date: "2025-10-20",
      },
      {
        student_id: 2,
        student_name: "Abdulahi",
        department: "Science",
        status: "Absent",
        date: "2025-10-20",
      },
      {
        student_id: 3,
        student_name: "Fatuma",
        department: "Arts",
        status: "Late",
        date: "2025-10-20",
      },
    ],
    2: [
      {
        student_id: 4,
        student_name: "Hassan",
        department: "Science",
        status: "Absent",
        date: "2025-10-21",
      },
      {
        student_id: 5,
        student_name: "Samira",
        department: "Arts",
        status: "Present",
        date: "2025-10-21",
      },
    ],
    3: [
      {
        student_id: 6,
        student_name: "Mariam",
        department: "Science",
        status: "Late",
        date: "2025-10-22",
      },
      {
        student_id: 7,
        student_name: "Abdi",
        department: "Arts",
        status: "Absent",
        date: "2025-10-22",
      },
    ],
  };

  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const selectedAttendance = selectedSessionId
    ? attendanceData[selectedSessionId]
    : [];

  const summary = {
    present: selectedAttendance.filter((a) => a.status === "Present").length,
    absent: selectedAttendance.filter((a) => a.status === "Absent").length,
    late: selectedAttendance.filter((a) => a.status === "Late").length,
    total: selectedAttendance.length,
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Session Attendance</h1>

      {/* Sessions List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`card shadow-lg cursor-pointer border ${
              selectedSessionId === s.id ? "border-primary" : "border-gray-200"
            }`}
            onClick={() => setSelectedSessionId(s.id)}
          >
            <div className="card-body">
              <h2 className="card-title">{s.subject}</h2>
              <p>Teacher: {s.teacher}</p>
              <p>Date: {s.date}</p>
              <p>
                Class: {s.batch} - {s.section}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Details */}
      {selectedSessionId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Attendance Details</h2>

          {/* Summary Cards */}
          <div className="flex gap-4 mb-4">
            <div className="card bg-green-600 text-white p-4">
              Present: {summary.present}
            </div>
            <div className="card bg-red-600 text-white p-4">
              Absent: {summary.absent}
            </div>
            <div className="card bg-yellow-600 text-white p-4">
              Late: {summary.late}
            </div>
            <div className="card bg-blue-600 text-white p-4">
              Total: {summary.total}
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {selectedAttendance.map((a, i) => (
                  <tr key={a.student_id}>
                    <td>{i + 1}</td>
                    <td>{a.student_name}</td>
                    <td>{a.department}</td>
                    <td>
                      <span
                        className={`font-semibold ${
                          a.status === "Present"
                            ? "text-green-600"
                            : a.status === "Absent"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td>{a.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
