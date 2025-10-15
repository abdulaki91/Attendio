import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/api";

export function useEditStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student) => {
      const { data } = await api.put(`/students/edit/${student.id}`, student);
      return data;
    },
    onSuccess: () => {
      toast.success("Student updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update student");
    },
  });
}
