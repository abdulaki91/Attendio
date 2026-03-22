import { useState, useMemo } from "react";
import {
  CheckCircle,
  GraduationCap,
  XCircle,
  TrendingUp,
  Calendar,
  Users,
  Clock,
  AlertTriangle,
} from "lucide-react";
import Card from "../Components/Card";
import BarChartComponent from "../Components/Dashboard/Barchart";
import PieChartComponent from "../Components/Dashboard/PieChart";
import AttendanceAlerts from "../Components/Dashboard/AttendanceAlerts";
import DashboardSkeleton from "../Components/Dashboard/DashboardSkeleton";
import useFetchResource from "../hooks/useFetchResource";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [dateRange, setDateRange] = useState("7"); // Last 7 days

  // Fetch dynamic data from API
  const { data: students = [], isLoading: loadingStudents } = useFetchResource(
    "students/get-students",
    "students",
  );

  const { data: deptOptions = [] } = useFetchResource(
    "students/get-departments",
    "departments",
  );

  const { data: attendance = [] } = useFetchResource(
    "attendance/get-latest",
    "attendance",
  );

  const { data: sessions = [] } = useFetchResource(
    "session/get-all-sessions",
    "sessions",
  );

  // Filter students by department
  const deptStudents = useMemo(() => {
    return selectedDepartment
      ? students.filter((s) => s.department === selectedDepartment)
      : students;
  }, [students, selectedDepartment]);

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    const filteredAttendance = selectedDepartment
      ? attendance.filter((a) => a.department === selectedDepartment)
      : attendance;

    const present = filteredAttendance.filter(
      (s) => s.status?.toLowerCase() === "present",
    ).length;

    const absent = filteredAttendance.filter(
      (s) => s.status?.toLowerCase() === "absent",
    ).length;

    const late = filteredAttendance.filter(
      (s) => s.status?.toLowerCase() === "late",
    ).length;

    const total = present + absent + late;
    const attendanceRate = total > 0 ? Math.round((present / total) * 100) : 0;

    return { present, absent, late, total, attendanceRate };
  }, [attendance, selectedDepartment]);

  // Calculate session statistics
  const sessionStats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todaySessions = sessions.filter((s) => s.session_date === today);

    const activeSessions = sessions.filter((s) => s.status === "active");

    return {
      totalSessions: sessions.length,
      todaySessions: todaySessions.length,
      activeSessions: activeSessions.length,
    };
  }, [sessions]);

  // KPI cards data
  const cardData = [
    {
      title: "Total Students",
      value: deptStudents.length,
      icon: <GraduationCap size={22} color="#3b82f6" />,
      trend: "+5%",
      trendUp: true,
    },
    {
      title: "Present Today",
      value: attendanceStats.present,
      icon: <CheckCircle size={22} color="#22c55e" />,
      trend: `${attendanceStats.attendanceRate}%`,
      trendUp: attendanceStats.attendanceRate >= 75,
    },
    {
      title: "Absent Today",
      value: attendanceStats.absent,
      icon: <XCircle size={22} color="#ef4444" />,
      trend: attendanceStats.absent > 0 ? "Alert" : "Good",
      trendUp: attendanceStats.absent === 0,
    },
    {
      title: "Active Sessions",
      value: sessionStats.activeSessions,
      icon: <Calendar size={22} color="#f59e0b" />,
      trend: `${sessionStats.todaySessions} today`,
      trendUp: sessionStats.todaySessions > 0,
    },
  ];

  // Aggregate attendance by date for trend chart
  const trendData = useMemo(() => {
    const map = {};
    const days = parseInt(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    attendance.forEach((a) => {
      const date = a.attendance_date;
      const recordDate = new Date(date);

      if (recordDate >= startDate) {
        if (!map[date]) {
          map[date] = {
            date: new Date(date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
            present: 0,
            absent: 0,
            total: 0,
            rate: 0,
          };
        }

        if (a.status?.toLowerCase() === "present") map[date].present += 1;
        else if (a.status?.toLowerCase() === "absent") map[date].absent += 1;

        map[date].total = map[date].present + map[date].absent;
        map[date].rate =
          map[date].total > 0
            ? Math.round((map[date].present / map[date].total) * 100)
            : 0;
      }
    });

    return Object.values(map).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  }, [attendance, dateRange]);

  // Department performance data
  const departmentPerformance = useMemo(() => {
    return deptOptions
      .map((dept) => {
        const deptCount = students.filter((s) => s.department === dept).length;
        const deptPresent = attendance.filter(
          (s) => s.department === dept && s.status?.toLowerCase() === "present",
        ).length;
        const deptAbsent = attendance.filter(
          (s) => s.department === dept && s.status?.toLowerCase() === "absent",
        ).length;

        const total = deptPresent + deptAbsent;
        const percentage =
          total > 0 ? Math.round((deptPresent / total) * 100) : 0;

        return {
          department: dept,
          totalStudents: deptCount,
          present: deptPresent,
          absent: deptAbsent,
          percentage,
          status:
            percentage >= 80
              ? "excellent"
              : percentage >= 60
                ? "good"
                : "needs-attention",
        };
      })
      .sort((a, b) => b.percentage - a.percentage);
  }, [deptOptions, students, attendance]);

  // Recent activity with more details
  const recentActivity = useMemo(() => {
    return attendance.slice(0, 8).map((entry) => ({
      ...entry,
      timeAgo: getTimeAgo(entry.created_at || entry.attendance_date),
      statusIcon:
        entry.status?.toLowerCase() === "present"
          ? "✅"
          : entry.status?.toLowerCase() === "late"
            ? "⏰"
            : "❌",
    }));
  }, [attendance]);

  // Helper function to calculate time ago
  function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  }

  // Show loading skeleton while data is loading
  if (loadingStudents) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary">Dashboard</h1>
          <p className="text-base-content/70 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <select
            className="select select-bordered select-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
          </select>

          <select
            className="select select-bordered select-sm"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardData.map((card, index) => (
          <div key={index} className="card bg-base-200 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-primary">
                    {card.value}
                  </p>
                  <div
                    className={`flex items-center gap-1 text-xs mt-1 ${
                      card.trendUp ? "text-success" : "text-error"
                    }`}
                  >
                    <TrendingUp
                      size={12}
                      className={card.trendUp ? "" : "rotate-180"}
                    />
                    {card.trend}
                  </div>
                </div>
                <div className="p-3 bg-base-100 rounded-lg">{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent />
        <PieChartComponent />
      </div>

      {/* Attendance Trend & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Trend */}
        <div className="col-span-2 card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Attendance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorAbsent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    value,
                    name === "rate" ? "Attendance Rate (%)" : name,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="present"
                  stackId="1"
                  stroke="#22c55e"
                  fillOpacity={1}
                  fill="url(#colorPresent)"
                />
                <Area
                  type="monotone"
                  dataKey="absent"
                  stackId="1"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorAbsent)"
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={{ fill: "#f59e0b" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Performance */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Department Performance</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {departmentPerformance.map((dept, idx) => (
                <div key={idx} className="p-3 bg-base-100 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="font-medium text-sm truncate"
                      title={dept.department}
                    >
                      {dept.department.length > 20
                        ? dept.department.substring(0, 20) + "..."
                        : dept.department}
                    </span>
                    <div
                      className={`badge badge-sm ${
                        dept.status === "excellent"
                          ? "badge-success"
                          : dept.status === "good"
                            ? "badge-warning"
                            : "badge-error"
                      }`}
                    >
                      {dept.percentage}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-base-content/70 mb-1">
                    <span>Present: {dept.present}</span>
                    <span>Total: {dept.totalStudents}</span>
                  </div>
                  <progress
                    className={`progress w-full ${
                      dept.status === "excellent"
                        ? "progress-success"
                        : dept.status === "good"
                          ? "progress-warning"
                          : "progress-error"
                    }`}
                    value={dept.percentage}
                    max="100"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg">Recent Activity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentActivity.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-base-100 rounded-lg"
              >
                <span className="text-lg">{entry.statusIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {entry.student_name || `Student ${entry.student_id}`}
                  </p>
                  <p className="text-xs text-base-content/70">
                    {entry.status?.charAt(0).toUpperCase() +
                      entry.status?.slice(1)}{" "}
                    • {entry.timeAgo}
                  </p>
                </div>
                <div className="text-xs text-base-content/50">
                  {entry.department}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Alerts */}
      <AttendanceAlerts />
    </div>
  );
}
