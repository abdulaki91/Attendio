import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  return useMutation({
    mutationFn: async (newStudent) => {
      await api.post(`/students/add-student`, newStudent);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["students", userId] });
      toast.success("Student added successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add student");
    },
  });
};
