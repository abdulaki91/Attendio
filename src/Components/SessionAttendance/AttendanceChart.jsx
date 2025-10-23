import { PieChart, Pie, Cell, Legend } from "recharts";

export default function AttendanceChart({ chartData }) {
  const COLORS = ["#16a34a", "#dc2626", "#eab308"];

  return (
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
  );
}
