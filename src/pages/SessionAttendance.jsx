import { useState, useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import { exportToCSV } from "../utils/exportToCSV";

import SessionList from "../Components/SessionAttendance/SessionList";
import AttendanceSummary from "../Components/SessionAttendance/AttendanceSummary";
import AttendanceControls from "../Components/SessionAttendance/AttendanceControls";
import AttendanceChart from "../Components/SessionAttendance/AttendanceChart";
import AttendanceTable from "../Components/SessionAttendance/AttendanceTable";
import StudentModal from "../Components/SessionAttendance/StudentModal";
import LoadingSpinner from "../Components/LoadingSpinner";
import { useFetchSessions } from "../hooks/useFetchSession";
import toLocalString from "../utils/toLocalString";

export default function SessionAttendance() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // 🔹 Fetch all sessions
  const { data: sessions = [], isLoading } = useFetchSessions();

  // 🔹 Normalize session data
  const sessionsList = useMemo(
    () =>
      sessions.map((session) => ({
        id: session.id,
        subject: session.department || session.subject,
        teacherName: session.teacherName,
        teacherEmail: session.teacherEmail,
        date: toLocalString(session.date),
        batch: session.batch,
        section: session.section,
        students: session.students || [],
      })),
    [sessions]
  );

  // 🔹 Find the currently selected session
  const selectedSession = sessionsList.find(
    (session) => session.id === selectedSessionId
  );

  // 🔹 Calculate total sessions for the selected class
  const totalSessions = useMemo(() => {
    if (!selectedSession) return 0;
    return sessionsList.filter(
      (s) =>
        s.subject === selectedSession.subject &&
        s.batch === selectedSession.batch &&
        s.section === selectedSession.section
    ).length;
  }, [selectedSession, sessionsList]);

  // 🔹 Extract attendance for the selected session
  const selectedAttendance = selectedSession?.students || [];

  // 🔹 Apply search & status filters
  const filteredAttendance = useMemo(
    () =>
      selectedAttendance
        .filter((a) => a.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((a) =>
          filterStatus === "All" ? true : a.status === filterStatus
        ),
    [selectedAttendance, searchTerm, filterStatus]
  );

  // 🔹 Attendance summary for the selected session
  const summary = useMemo(() => {
    const present = selectedAttendance.filter(
      (a) => a.status === "Present"
    ).length;
    const absent = selectedAttendance.filter(
      (a) => a.status === "Absent"
    ).length;
    return { present, absent, total: selectedAttendance.length };
  }, [selectedAttendance]);

  // 🔹 Calculate absence % per student across all sessions of that class
  const absenceStats = useMemo(() => {
    if (!selectedSession || totalSessions === 0) return {};

    const classSessions = sessionsList.filter(
      (s) =>
        s.subject === selectedSession.subject &&
        s.batch === selectedSession.batch &&
        s.section === selectedSession.section
    );

    const stats = {};

    classSessions.forEach((session) => {
      session.students.forEach((student) => {
        const id = student.id_number || student.id || student.name; // safer fallback
        if (!stats[id]) {
          stats[id] = { name: student.name, totalAbsent: 0 };
        }
        if (student.status === "Absent") {
          stats[id].totalAbsent += 1;
        }
      });
    });

    // Compute absence percentage
    Object.keys(stats).forEach((id) => {
      stats[id].absentPercentage = (
        (stats[id].totalAbsent / totalSessions) *
        100
      ).toFixed(1);
    });

    return stats;
  }, [selectedSession, sessionsList, totalSessions]);

  // 🔹 Chart Data
  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

  // 🔹 Loading state
  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarCheck size={22} /> Session Attendance
        </h1>
        <LoadingSpinner />
      </div>
    );
  }

  // 🔹 Empty state
  if (!sessions.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarCheck size={22} /> Session Attendance
        </h1>
        <p className="mt-4 text-gray-600">No sessions available.</p>
      </div>
    );
  }

  // ✅ Main UI
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCheck size={22} /> Session Attendance
      </h1>

      {/* 🔸 Session List */}
      <SessionList
        sessions={sessionsList}
        selectedSessionId={selectedSessionId}
        onSelect={setSelectedSessionId}
      />

      {/* 🔸 Attendance Details */}
      {selectedSession && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Attendance Details</h2>

          {/* Total Sessions */}
          <p className="text-md font-medium">
            Total Sessions for{" "}
            <span className="font-semibold">{selectedSession.subject}</span> (
            {selectedSession.batch} - {selectedSession.section}):{" "}
            <span className="font-semibold text-blue-600">{totalSessions}</span>
          </p>

          {/* Summary */}
          <AttendanceSummary
            summary={summary}
            setFilterStatus={setFilterStatus}
          />

          {/* Controls + Chart */}
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <AttendanceControls
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onExport={() => exportToCSV(filteredAttendance, "attendance.csv")}
            />
            <AttendanceChart chartData={chartData} />
          </div>

          {/* Table */}
          <AttendanceTable
            data={filteredAttendance}
            absenceStats={absenceStats}
            onSelectStudent={setSelectedStudent}
          />

          {/* Student Modal */}
          <StudentModal
            student={selectedStudent}
            onClose={() => setSelectedStudent(null)}
          />
        </div>
      )}
    </div>
  );
}
