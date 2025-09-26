import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

const fetchBatches = async (token) => {
  const { data } = await axios.get(`${baseUri}/students/get-batches`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data.data || [];
};

export const useBatches = () => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["batches", userId],
    queryFn: () => fetchBatches(token),
    enabled: Boolean(token),
  });
};
