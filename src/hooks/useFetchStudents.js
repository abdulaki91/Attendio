import { useQuery } from "@tanstack/react-query";
import baseUri from "../baseURI/BaseUri";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const fetchStudents = async (token) => {
  const { data } = await axios.get(`${baseUri}/students/get-students`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // Data already in the desired shape from backend
  return data.map((s) => ({
    id: s.id,
    fullname: s.fullname,
    department: s.department,
    batch: s.batch,
    year: s.year,
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
