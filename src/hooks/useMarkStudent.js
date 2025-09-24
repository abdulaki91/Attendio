import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";

export default function useMarkStudent() {
  const queryClient = useQueryClient(); // <-- use existing QueryClient
  return useMutation({
    mutationKey: ["mark-student"],
    mutationFn: async ({ studentId, date }) => {
      const response = await axios.post(
        `${baseUri}/attendance/create-attendance`,
        {
          student_id: studentId,
          attendance_date: date,
        }
      );
      return response.data;
    },
    onError: (error) => {
      toast.error("Failed to mark student attendance: " + error.message);
    },
    onSuccess: (data) => {
      // Invalidate students query to refetch and update UI
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success(data.message, { duration: 2000 });
    },
  });
}
