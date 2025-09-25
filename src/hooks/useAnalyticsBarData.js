import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

const fetchBarData = async (token, { date }) => {
  const { data } = await axios.get(
    `${baseUri}/analytics/attendance-summary?date=${encodeURIComponent(date)}`,
    token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
  );
  const rows = Array.isArray(data) ? data : data.data || [];
  return rows.map((r) => ({ name: r.label, present: r.present, absent: r.absent }));
};

export const useAnalyticsBarData = (filters) => {
  const { token, userId } = useAuth();
  return useQuery({
    queryKey: ["bar_analytics", userId, filters],
    queryFn: () => fetchBarData(token, filters),
    enabled: Boolean(filters?.date && token),
  });
};


