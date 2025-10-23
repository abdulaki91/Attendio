import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api";
import toast from "react-hot-toast";

export default function useCreateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionData) => {
      const { data } = await api.post("/session/create-session", sessionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["sessions"]);

      toast.success("Session created successfully!");
    },
  });
}
