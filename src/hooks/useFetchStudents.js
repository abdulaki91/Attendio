import { useQuery } from "@tanstack/react-query";

import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const fetchStudents = async () => {
  const { data } = await api.get(`/students/get-students`, {});

  // Data already in the desired shape from backend
  return data.map((s) => ({
    id: s.id,
    fullname: s.fullname,
    department: s.department,
    batch: s.batch,
    section: s.section,
    id_number: s.id_number,
    gender: s.gender,
  }));
};

export const useFetchStudents = () => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["students", userId],
    queryFn: () => fetchStudents(token),
    // staleTime: 1000 * 60 * 5,
  });
};
