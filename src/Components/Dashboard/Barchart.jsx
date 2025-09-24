import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const transformAttendanceByGrade = (students, attendance) => {
  const grouped = {};

  // Group all students by grade
  students.forEach((student) => {
    const grade = student.grade || "Unknown";
    if (!grouped[grade]) {
      grouped[grade] = { name: grade, total: 0, present: 0, absent: 0 };
    }
    grouped[grade].total += 1;
  });

  // Count present students
  attendance.forEach((record) => {
    const grade = record.grade || "Unknown";
    if (!grouped[grade]) {
      grouped[grade] = { name: grade, total: 0, present: 0, absent: 0 };
    }
    if (record.status === "present") {
      grouped[grade].present += 1;
    }
  });

  // Compute absent = total - present
  Object.keys(grouped).forEach((grade) => {
    grouped[grade].absent = grouped[grade].total - grouped[grade].present;
  });

  return Object.values(grouped);
};

const data = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
const BarChartComponent = ({ students, attendance }) => {
  const chartData =
    students && students.length > 0
      ? transformAttendanceByGrade(students, attendance)
      : [];

  const presentColor = "#3b82f6"; // blue
  const absentColor = "#ef4444"; // red

  return (
    <div className="card w-full shadow-xl bg-base-100 p-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">
        Attendance by Grade
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="present"
            fill={presentColor}
            name="Present"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill={absentColor}
            name="Absent"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
