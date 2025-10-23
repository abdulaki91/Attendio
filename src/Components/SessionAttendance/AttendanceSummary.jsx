import { UserCheck, UserX, Clock } from "lucide-react";

export default function AttendanceSummary({ summary, setFilterStatus }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <SummaryCard
        color="bg-green-600 hover:bg-green-700"
        label="Present"
        icon={<UserCheck />}
        value={summary.present}
        onClick={() => setFilterStatus("Present")}
      />
      <SummaryCard
        color="bg-red-600 hover:bg-red-700"
        label="Absent"
        icon={<UserX />}
        value={summary.absent}
        onClick={() => setFilterStatus("Absent")}
      />

      <SummaryCard
        color="bg-blue-600 hover:bg-blue-700"
        label="Total"
        value={summary.total}
        onClick={() => setFilterStatus("All")}
      />
    </div>
  );
}

const SummaryCard = ({ color, label, value, icon, onClick }) => (
  <div
    onClick={onClick}
    className={`card text-white p-4 cursor-pointer transition ${color}`}
  >
    <div className="flex items-center gap-2">
      {icon} {label}
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
