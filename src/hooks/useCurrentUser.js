// hooks/useUser.js
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";

export const useUser = () => {
  const { token, userId } = useAuth();

  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${baseUri}/users/get-user-by-id/${userId}`
      );
      return data;
    },
    enabled: !!token && !!userId, // fetch only when both exist
    staleTime: 1000 * 60,
  });
};
