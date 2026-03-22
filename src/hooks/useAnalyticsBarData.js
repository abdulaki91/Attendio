import { useMemo } from "react";
import useFetchResource from "./useFetchResource";

export const useAnalyticsBarData = ({ date }) => {
  const { data: students = [], isLoading: loadingStudents } = useFetchResource(
    "students/get-students",
    "students",
  );

  const { data: attendance = [], isLoading: loadingAttendance } =
    useFetchResource("attendance/get-latest", "attendance");

  const { data: departments = [] } = useFetchResource(
    "students/get-departments",
    "departments",
  );

  const isLoading = loadingStudents || loadingAttendance;

  const data = useMemo(() => {
    if (!departments.length || !attendance.length) return [];

    return departments.map((dept) => {
      const deptStudents = students.filter((s) => s.department === dept);
      const deptAttendance = attendance.filter(
        (a) => a.department === dept && (!date || a.attendance_date === date),
      );

      const present = deptAttendance.filter(
        (a) => a.status?.toLowerCase() === "present",
      ).length;

      const absent = deptAttendance.filter(
        (a) => a.status?.toLowerCase() === "absent",
      ).length;

      return {
        name: dept.length > 15 ? dept.substring(0, 15) + "..." : dept,
        fullName: dept,
        present,
        absent,
        total: deptStudents.length,
      };
    });
  }, [departments, students, attendance, date]);

  return { data, isLoading };
};
