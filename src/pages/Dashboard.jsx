import { useState, useMemo } from "react";
import { CheckCircle, GraduationCap, XCircle, TrendingUp } from "lucide-react";
import Card from "../Components/Card";
import useFetchResource from "../hooks/useFetchResource";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // Fetch dynamic data from API
  const { data: students = [], isLoading: loadingStudents } = useFetchResource(
    "students/get-students",
    "students"
  );

  const { data: deptOptions = [] } = useFetchResource(
    "students/get-departments",
    "departments"
  );

  const { data: attendance = [] } = useFetchResource(
    "attendance/get-latest",
    "attendance"
  );

  const deptStudents = useMemo(() => {
    return selectedDepartment
      ? students.filter((s) => s.department === selectedDepartment)
      : students;
  }, [students, selectedDepartment]);

  // Count present / absent for cards
  const presentCount = attendance.filter(
    (s) =>
      s.status.toLowerCase() === "present" &&
      (!selectedDepartment || s.department === selectedDepartment)
  ).length;

  const absentCount = attendance.filter(
    (s) =>
      s.status.toLowerCase() === "absent" &&
      (!selectedDepartment || s.department === selectedDepartment)
  ).length;

  // KPI cards data
  const cardData = [
    {
      title: "Total Students",
      value: deptStudents.length,
      icon: <GraduationCap size={22} color="blue" />,
    },
    {
      title: "Present Today",
      value: presentCount,
      icon: <CheckCircle size={22} color="green" />,
    },
    {
      title: "Absent Today",
      value: absentCount,
      icon: <XCircle size={22} color="red" />,
    },
    {
      title: "Avg Attendance %",
      value: Math.round(
        (presentCount / (presentCount + absentCount || 1)) * 100
      ),
      icon: <TrendingUp size={22} color="orange" />,
    },
  ];

  // Aggregate attendance by date for chart
  const trendData = useMemo(() => {
    const map = {};
    attendance.forEach((a) => {
      const date = a.attendance_date;
      if (!map[date]) map[date] = { date, present: 0, absent: 0 };
      if (a.status.toLowerCase() === "present") map[date].present += 1;
      else map[date].absent += 1;
    });
    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }, [attendance]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-accent">Dashboard</h1>
        <div className="flex gap-3 items-center">
          <select
            className="select select-bordered"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            {deptOptions.map((dept, idx) => (
              <option key={idx} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <Card
            key={index}
            isLoading={loadingStudents}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      {/* Charts + Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="col-span-2 bg-base-200 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Attendance Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="present" stroke="#22c55e" />
              <Line type="monotone" dataKey="absent" stroke="#ef4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Leaderboard */}
        <div className="bg-base-200 p-4 rounded-lg shadow">
          <h2 className="font-semibold mb-2">Department Attendance</h2>
          {deptOptions.map((dept, idx) => {
            const deptCount = students.filter(
              (s) => s.department === dept
            ).length;
            const deptPresent = attendance.filter(
              (s) =>
                s.department === dept && s.status.toLowerCase() === "present"
            ).length;
            const percentage = deptCount
              ? Math.round((deptPresent / deptCount) * 100)
              : 0;
            return (
              <div key={idx} className="mb-3">
                <div className="flex justify-between text-sm">
                  <span>{dept}</span>
                  <span>{percentage}%</span>
                </div>
                <progress
                  className="progress progress-success w-full"
                  value={percentage}
                  max="100"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-base-200 p-4 rounded-lg shadow">
        <h2 className="font-semibold mb-2">Recent Activity</h2>
        <ul className="space-y-2 text-sm">
          {attendance.slice(0, 5).map((entry, idx) => (
            <li key={idx}>
              {entry.status.toLowerCase() === "present" ? "✅" : "❌"}{" "}
              {entry.student_name}{" "}
              {entry.status.toLowerCase() === "present"
                ? "marked present"
                : "absent"}{" "}
              on {entry.attendance_date}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
