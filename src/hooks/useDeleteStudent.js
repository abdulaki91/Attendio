import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import baseUri from "../baseURI/BaseUri";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function useDeleteStudent() {
  const queryClient = useQueryClient();
  const { token } = useAuth(); // get token from context
  return useMutation({
    mutationFn: async (student) => {
      await axios.delete(`${baseUri}/students/delete/${student.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      toast.success("Student deleted successfully!");
    },
  });
}
