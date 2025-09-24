import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";

export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStudent) => {
      await axios.post(`${baseUri}/students/add-student`, newStudent);
    },
    onSuccess: () => {
      // Invalidate and refetch
      toast.success("Student added successfully!");
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to add student");
    },
  });
};
