import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const fetchDepartments = async () => {
  const { data } = await api.get(`/students/get-departments`);
  return Array.isArray(data) ? data : data.data || [];
};

export const useDepartments = () => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["departments", userId],
    queryFn: () => fetchDepartments(token),
    enabled: Boolean(token),
  });
};
