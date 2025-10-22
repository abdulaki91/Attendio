import { useState } from "react";
import {
  Search,
  CalendarCheck,
  UserCheck,
  UserX,
  Clock,
  FileDown,
} from "lucide-react";
import { PieChart, Pie, Cell, Legend } from "recharts";

// CSV export helper
const exportToCSV = (data, fileName) => {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));
  for (const row of data) {
    const values = headers.map((header) => `"${row[header]}"`);
    csvRows.push(values.join(","));
  }
  const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
};

export default function SessionAttendance() {
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  const selectedAttendance = selectedSessionId
    ? attendanceData[selectedSessionId]
    : [];

  const filteredAttendance = selectedAttendance
    .filter((a) =>
      a.student_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((a) => (filterStatus === "All" ? true : a.status === filterStatus));

  const summary = {
    present: selectedAttendance.filter((a) => a.status === "Present").length,
    absent: selectedAttendance.filter((a) => a.status === "Absent").length,
    late: selectedAttendance.filter((a) => a.status === "Late").length,
    total: selectedAttendance.length,
  };

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
    { name: "Late", value: summary.late },
  ];
  const COLORS = ["#16a34a", "#dc2626", "#eab308"];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCheck size={22} /> Session Attendance
      </h1>

      {/* Sessions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sessions.map((s) => (
          <div
            key={s.id}
            className={`card shadow-md cursor-pointer border transition-all hover:shadow-lg ${
              selectedSessionId === s.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-gray-200"
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

      {/* Attendance Section */}
      {selectedSessionId && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Attendance Details</h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              onClick={() => setFilterStatus("Present")}
              className="card bg-green-600 text-white p-4 cursor-pointer hover:bg-green-700 transition"
            >
              <div className="flex items-center gap-2">
                <UserCheck /> Present
              </div>
              <div className="text-2xl font-bold">{summary.present}</div>
            </div>
            <div
              onClick={() => setFilterStatus("Absent")}
              className="card bg-red-600 text-white p-4 cursor-pointer hover:bg-red-700 transition"
            >
              <div className="flex items-center gap-2">
                <UserX /> Absent
              </div>
              <div className="text-2xl font-bold">{summary.absent}</div>
            </div>
            <div
              onClick={() => setFilterStatus("Late")}
              className="card bg-yellow-500 text-white p-4 cursor-pointer hover:bg-yellow-600 transition"
            >
              <div className="flex items-center gap-2">
                <Clock /> Late
              </div>
              <div className="text-2xl font-bold">{summary.late}</div>
            </div>
            <div
              onClick={() => setFilterStatus("All")}
              className="card bg-blue-600 text-white p-4 cursor-pointer hover:bg-blue-700 transition"
            >
              <div>Total</div>
              <div className="text-2xl font-bold">{summary.total}</div>
            </div>
          </div>

          {/* Chart + Controls */}
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-2.5 text-gray-500"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input input-bordered w-full pl-10"
                />
              </div>
              <select
                className="select select-bordered"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>All</option>
                <option>Present</option>
                <option>Absent</option>
                <option>Late</option>
              </select>
              <button
                onClick={() =>
                  exportToCSV(filteredAttendance, "attendance.csv")
                }
                className="btn btn-outline flex items-center gap-2"
              >
                <FileDown size={16} /> Export
              </button>
            </div>

            {/* Pie Chart */}
            <div className="flex justify-center">
              <PieChart width={250} height={200}>
                <Pie data={chartData} dataKey="value" outerRadius={70} label>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </div>
          </div>

          {/* Table */}
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
                {filteredAttendance.length > 0 ? (
                  filteredAttendance.map((a, i) => (
                    <tr
                      key={a.student_id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => setSelectedStudent(a)}
                    >
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-gray-500">
                      No matching students
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Student Modal */}
          {selectedStudent && (
            <dialog className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">
                  {selectedStudent.student_name}
                </h3>
                <p>Department: {selectedStudent.department}</p>
                <p>Status: {selectedStudent.status}</p>
                <p>Date: {selectedStudent.date}</p>
                <div className="modal-action">
                  <button
                    className="btn"
                    onClick={() => setSelectedStudent(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </dialog>
          )}
        </div>
      )}
    </div>
  );
}
