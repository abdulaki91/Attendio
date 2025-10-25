import { useState, useMemo } from "react";
import { CalendarCheck } from "lucide-react";
import { exportToCSV } from "../utils/exportToCSV";

import SessionList from "../Components/SessionAttendance/SessionList";
import AttendanceSummary from "../Components/SessionAttendance/AttendanceSummary";
import AttendanceControls from "../Components/SessionAttendance/AttendanceControls";
import AttendanceChart from "../Components/SessionAttendance/AttendanceChart";
import AttendanceTable from "../Components/SessionAttendance/AttendanceTable";
import LoadingSpinner from "../Components/LoadingSpinner";
import toLocalString from "../utils/toLocalString";
import useFetchResource from "../hooks/useFetchResource";

export default function SessionAttendance() {
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // 🔹 Fetch all sessions (raw)
  const { data: rawSessions = [], isLoading } = useFetchResource(
    "session/get-all-sessions",
    "sessions"
  );

  // 🔹 Normalize sessions data for UI here (previously done inside the hook)
  const sessions = useMemo(
    () =>
      rawSessions.map((session) => ({
        id: session.session_id,
        subject: session.subject || session.department,
        department: session.department,
        batch: session.batch,
        section: session.section,
        date: new Date(session.session_date).toLocaleDateString(),
        created_at: new Date(session.created_at).toLocaleString(),
        teacher: session.teacher,
        students:
          session.attendance?.map((a) => ({
            attendance_id: a.attendance_id,
            id: a.student_id,
            name: a.student_name,
            id_number: a.id_number,
            gender: a.gender,
            status: a.status,
          })) || [],
      })),
    [rawSessions]
  );

  // 🔹 Format sessions for UI display
  const sessionsList = useMemo(
    () =>
      sessions.map((session) => ({
        id: session.id,
        subject: session.subject,
        teacherName: session.teacher?.name,
        teacherEmail: session.teacher?.email,
        department: session.department,
        date: toLocalString(session.date),
        batch: session.batch,
        section: session.section,
        students: session.students || [],
      })),
    [sessions]
  );

  const selectedSession = sessionsList.find(
    (session) => session.id === selectedSessionId
  );

  const totalSessions = useMemo(() => {
    if (!selectedSession) return 0;
    return sessionsList.filter(
      (s) =>
        s.department === selectedSession.department &&
        s.batch === selectedSession.batch &&
        s.section === selectedSession.section
    ).length;
  }, [selectedSession, sessionsList]);

  const selectedAttendance = useMemo(
    () => selectedSession?.students || [],
    [selectedSession]
  );

  const filteredAttendance = useMemo(
    () =>
      selectedAttendance
        .filter((a) => a.name?.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter((a) =>
          filterStatus === "All" ? true : a.status === filterStatus
        ),
    [selectedAttendance, searchTerm, filterStatus]
  );

  const summary = useMemo(() => {
    const present = selectedAttendance.filter(
      (a) => a.status === "Present"
    ).length;
    const absent = selectedAttendance.filter(
      (a) => a.status === "Absent"
    ).length;
    return { present, absent, total: selectedAttendance.length };
  }, [selectedAttendance]);

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
        const id = student.id_number || student.id || student.name;
        if (!stats[id]) {
          stats[id] = { name: student.name, totalAbsent: 0 };
        }
        if (student.status === "Absent") {
          stats[id].totalAbsent += 1;
        }
      });
    });

    Object.keys(stats).forEach((id) => {
      stats[id].absentPercentage = (
        (stats[id].totalAbsent / totalSessions) *
        100
      ).toFixed(1);
    });

    return stats;
  }, [selectedSession, sessionsList, totalSessions]);

  const chartData = [
    { name: "Present", value: summary.present },
    { name: "Absent", value: summary.absent },
  ];

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

  if (!sessions.length) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarCheck size={22} /> Session Attendance
        </h1>
        <p className="mt-4">No sessions available.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CalendarCheck size={22} /> Session Attendance
      </h1>

      <SessionList
        sessions={sessionsList}
        selectedSessionId={selectedSessionId}
        onSelect={setSelectedSessionId}
      />

      {selectedSession && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold mb-2">Attendance Details</h2>

          <p className="text-md font-medium">
            Total Sessions for{" "}
            <span className="font-semibold">{selectedSession.subject}</span> (
            {selectedSession.batch} - {selectedSession.section}) :{" "}
            <span className="font-bold text-xl">{totalSessions}</span>
          </p>

          <AttendanceSummary
            summary={summary}
            setFilterStatus={setFilterStatus}
          />

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

          <AttendanceTable
            data={filteredAttendance}
            absenceStats={absenceStats}
          />
        </div>
      )}
    </div>
  );
}
