import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

const fetchBatches = async (token) => {
  const res = await axios.get(`${baseUri}/students/get-batches`, {
    headers: { Authorization: `Bearer ${token}` },
  });

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
