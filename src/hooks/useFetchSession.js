import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

// --- Fetch all sessions for a given teacher ---
const fetchSessions = async () => {
  const { data } = await api.get(`/session/get-all-sessions`);

  // --- Normalize data for the UI ---
  return data.map((session) => ({
    id: session.session_id,
    department: session.department,
    batch: session.batch,
    section: session.section,
    date: new Date(session.session_date).toLocaleDateString(),
    created_at: new Date(session.created_at).toLocaleString(),
    teacher: session.teacher,
    students: session.attendance.map((a) => ({
      attendance_id: a.attendance_id,
      id: a.student_id,
      name: a.student_name,
      id_number: a.id_number,
      gender: a.gender,
      status: a.status,
    })),
  }));
};

// --- React Query Hook ---
export const useFetchSessions = () => {
  const { userId } = useAuth();

  return useQuery({
    queryKey: ["sessions", userId],
    queryFn: () => fetchSessions(),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};
