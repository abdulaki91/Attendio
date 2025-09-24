import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <p className="text-gray-600">Redirecting to login...</p>
      <p className="text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
}

export default Home;
