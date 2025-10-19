import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "../api/api";

export default function useMarkStudent() {
  const queryClient = useQueryClient(); // <-- use existing QueryClient
  return useMutation({
    mutationKey: ["mark-student"],
    mutationFn: async ({ studentId, date }) => {
      const response = await api.post(`/attendance/create-attendance`, {
        student_id: studentId,
        attendance_date: date,
      });
      return response.data;
    },

    onSuccess: (data) => {
      // Invalidate students query to refetch and update UI
      queryClient.invalidateQueries({ queryKey: ["attendance_students"] });
      toast.success(data.message, { duration: 2000 });
    },
  });
}
