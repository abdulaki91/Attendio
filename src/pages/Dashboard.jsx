import { useState } from "react";
import Select from "../Components/Select";
import { CheckCircle, GraduationCap, XCircle } from "lucide-react";
import Card from "../Components/Card";
import { useDepartments } from "../hooks/useDepartments";
import { useFetchStudents } from "../hooks/useFetchStudents";
export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [attendance, setAttendance] = useState([]);
  const { data: students = [], isLoading } = useFetchStudents();

  const { data: deptOptions = [] } = useDepartments();

  const deptStudents = selectedDepartment
    ? students.filter((s) => s.department === selectedDepartment)
    : students;

  const presentCount = attendance.filter((s) => s.status === "present").length;

  const cardData = [
    {
      title: "Total Students",
      value: deptStudents.length,
      icon: <GraduationCap size={22} color="blue" />,
    },
    {
      title: "Total Present",
      value: presentCount,
      icon: <CheckCircle size={22} color="green" />,
    },
    {
      title: "Total Absent",
      value: deptStudents.length - presentCount,
      icon: <XCircle size={22} color="red" />,
    },
  ];

  return (
    <div className="p-4 text-sm md:textarea-md lg:text-lg flex justify-around flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-accent">Dashboard</h1>
        <div className="flex gap-3 items-center justify-center">
          <input
            className="input input-bordered border-blue-400 w-max"
            type="date"
            name="dashboard-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            id="dashboard-date"
          />
          <Select
            options={deptOptions}
            label="Select Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-around flex-col items-center md:flex-row mt-6">
        {cardData.map((card, index) => (
          <Card
            key={index}
            isLoading={isLoading}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-6"></div>

      <div className="flex justify-between items-center mt-6"></div>
    </div>
  );
}
