import { useEffect, useState } from "react";
import Select from "../Components/Select";
import { CheckCircle, GraduationCap, XCircle } from "lucide-react";
import BarChartComponent from "../Components/Dashboard/Barchart";
import Card from "../Components/Card";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
const gradeStudents = selectedGrade
  ? students.filter((s) => s.grade === selectedGrade)
  : students;

const presentCount = attendance.filter((s) => s.status === "present").length;

const cardData = [
  {
    title: "Total Students",
    value: gradeStudents.length,
    icon: <GraduationCap size={22} color="blue" />,
  },
  {
    title: "Total Present",
    value: presentCount,
    icon: <CheckCircle size={22} color="green" />,
  },
  {
    title: "Total Absent",
    value: gradeStudents.length - presentCount,
    icon: <XCircle size={22} color="red" />,
  },
];

  // // Fetch students from DB
  // useEffect(() => {
  //   const fetchStudents = async () => {
  //     try {
  //       const response = await axios.get(`${baseUri}/students/get-students`);
  //       setStudents(response.data);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchStudents();
  // }, []);

  // Fetch attendance whenever date or grade changes
  useEffect(() => {
    // if (!selectedDate) return;

    const fetchAttendance = async () => {
      try {
        const response = await axios.get(
          `${baseUri}/attendance/get-attendance`,
          {
            params: { date: selectedDate, grade: selectedGrade },
          }
        );

        const normalized = response.data.map((s) => ({
          ...s,
          status: s.status ? s.status.toLowerCase() : "absent",
        }));

        setAttendance(normalized);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAttendance();
  }, [selectedDate, selectedGrade]);

  return (
    <div className="p-4 text-sm md:textarea-md lg:text-lg flex justify-around flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-accent">Dashboard</h1>
        <div className="flex gap-3">
          <input
            className="input input-bordered border-blue-400 w-max"
            type="date"
            name="dashboard-date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            id="dashboard-date"
          />
          <Select
            options={["6th", "7th", "8th"]}
            label="Select Grade"
            value={selectedGrade}
            onChange={setSelectedGrade}
          />
        </div>
      </div>

      <div className="flex justify-around flex-col items-center md:flex-row mt-6">
        {cardData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <BarChartComponent attendance={attendance} />
      </div>
    </div>
  );
}
