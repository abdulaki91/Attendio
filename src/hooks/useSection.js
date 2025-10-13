import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
const fetchSectionData = async (token) => {
  const { data } = axios.get(`${baseUri}/students/get-section`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return Array.isArray(data) ? data : data.data || [];
};

export const useSections = () => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["section", userId],
    queryFn: () => fetchSectionData(token),
    enabled: Boolean(token),
  });
};
