// ProtectedRoute.jsx
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

function ProtectedRoute({ children }) {
  const { isAuthenticated, login } = useKindeAuth();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    login();
    return <p className="text-center text-gray-600 mt-10">Redirecting...</p>;
  }

  return children;
}

export default ProtectedRoute;
