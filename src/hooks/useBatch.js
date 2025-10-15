import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

const fetchBatches = async () => {
  const res = await api.get(`/students/get-batches`);
  // Normalize structure and safely extract batches
  const batches = res.data?.data;

  return Array.isArray(batches) ? batches : [];
};

export const useBatches = () => {
  const { token, userId } = useAuth();

  return useQuery({
    queryKey: ["batches", userId],
    queryFn: () => fetchBatches(token),
    enabled: Boolean(token),
    staleTime: 5 * 60 * 1000, // optional optimization: cache 5 minutes
  });
};
