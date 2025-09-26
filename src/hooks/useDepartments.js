import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";

const fetchDepartments = async (token) => {
  const { data } = await axios.get(`${baseUri}/students/get-departments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log(data);
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
