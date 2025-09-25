import React, { useMemo } from "react";
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

import { useAnalyticsBarData } from "../../hooks/useAnalyticsBarData.js";

const todayString = () => {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
};

const BarChartComponent = () => {
  const presentColor = "#3b82f6"; // Tailwind blue-500
  const absentColor = "#ef4444"; // Tailwind red-500
  const defaultDate = useMemo(() => todayString(), []);
  const { data = [], isLoading } = useAnalyticsBarData({ date: defaultDate });

  return (
    <div className="card w-full shadow-xl bg-base-100 p-4">
      <h2 className="text-xl font-semibold text-base-content mb-4">
        Attendance by Department
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="present"
            fill={presentColor}
            name={isLoading ? "Loading..." : "Present"}
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="absent"
            fill={absentColor}
            name={isLoading ? "Loading..." : "Absent"}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartComponent;
