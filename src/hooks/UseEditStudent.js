import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import baseUri from "../baseURI/BaseUri";
import { useAuth } from "../context/AuthContext";
export function useEditStudent() {
  const queryClient = useQueryClient();
  const { token } = useAuth(); // get token from context
  return useMutation({
    mutationFn: async (student) => {
      const { data } = await axios.put(
        `${baseUri}/students/edit/${student.id}`,
        student,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
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
