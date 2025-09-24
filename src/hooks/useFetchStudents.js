import { useQuery } from "@tanstack/react-query";
import baseUri from "../baseURI/BaseUri";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const fetchStudents = async (token) => {
  const { data } = await axios.get(
    `${baseUri}/attendance/fetch-students-with-attendance`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return data.students.map((student) => ({
    id_number: student.id_number,
    fullname: student.fullname,
    department: student.department,
    batch: student.batch,
    id: student.student_id,
    year: student.year,
    gender: student.gender,
    attendance: student.attendance.map((att) => ({
      attendance_date: att.attendance_date,
      status: att.status,
    })),
  }));
};

export const useFetchStudents = () => {
  const { token, userId } = useAuth(); // get token from context
  return useQuery({
    queryKey: ["students", userId], // cache per teacher
    queryFn: () => fetchStudents(token), // pass it to fetch
    enabled: !!userId, // don't run if userId doesn't exist yet
    // staleTime: 1000 * 60 * 5,
  });
};
