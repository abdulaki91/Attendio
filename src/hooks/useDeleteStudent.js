import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/api";

export default function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (student) => {
      await api.delete(`/students/delete/${student.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully!");
    },
  });
}
