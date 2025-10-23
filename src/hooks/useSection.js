import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api";

const fetchSectionData = async () => {
  const { data } = await api.get(`/students/get-sections`);
  return Array.isArray(data) ? data : data.data || [];
};

export const useSections = () => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["section", userId],
    queryFn: fetchSectionData,
    enabled: Boolean(token),
  });
};
