import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import useFetchResource from "../../hooks/useFetchResource";

const COLORS = {
  present: "#22c55e", // green
  absent: "#ef4444", // red
  late: "#f59e0b", // amber
};

const PieChartComponent = () => {
  const { data: attendance = [], isLoading } = useFetchResource(
    "attendance/get-latest",
    "attendance",
  );

  const pieData = useMemo(() => {
    if (!attendance.length) return [];

    const statusCounts = attendance.reduce((acc, record) => {
      const status = record.status?.toLowerCase() || "absent";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: COLORS[status] || "#6b7280",
    }));
  }, [attendance]);

  const renderCustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (isLoading) {
    return (
      <div className="card w-full shadow-xl bg-base-100 p-4">
        <h2 className="text-xl font-semibold text-base-content mb-4">
          Today's Attendance Overview
        </h2>
        <div className="flex justify-center items-center h-80">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full shadow-xl bg-base-100 p-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">
        Today's Attendance Overview
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            labelStyle={{ color: "#000" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
