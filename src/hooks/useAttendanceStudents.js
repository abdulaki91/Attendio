import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

const buildQueryString = (params) => {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      qs.append(key, value);
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : "";
};

const fetchAttendanceStudents = async (token, { date, department, batch ,section}) => {
  const query = buildQueryString({ date, department, batch ,section});
  const { data } = await axios.get(
    `${baseUri}/attendance/fetch-students-with-attendance${query}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  // Normalize shape if backend responds with { students }
  const students = Array.isArray(data) ? data : data.students || [];
  return students.map((student) => ({
    id: student.id,
    fullname: student.fullname,
    department: student.department,
    batch: student.batch,
    section: student.section,
    year: student.year,
    id_number: student.id_number,
    gender: student.gender,
    attendance: (student.attendance || []).map((att) => ({
      attendance_date: att.attendance_date,
      status: att.status,
    })),
  }));
};

export const useAttendanceStudents = (filters) => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["attendance_students", userId, filters],
    queryFn: () => fetchAttendanceStudents(token, filters),
  });
};
