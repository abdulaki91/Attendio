import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  const { token, userId } = useAuth();
  return useMutation({
    mutationFn: async (newStudent) => {
      await axios.post(`${baseUri}/students/add-student`, newStudent, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
