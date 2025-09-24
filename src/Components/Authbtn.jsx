import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export default function AuthButton() {
  const { login, register, logout, isAuthenticated, user } = useKindeAuth();

  if (!isAuthenticated) {
    return (
      <div className="flex space-x-4">
        <button
          onClick={login}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Sign In
        </button>
        <button
          onClick={register}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <p className="text-lg text-gray-700">
        Welcome,{" "}
        <span className="font-semibold">{user?.given_name || user?.email}</span>{" "}
        🎉
      </p>
      <button
        onClick={logout}
        className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
      >
        Sign Out
      </button>
    </div>
  );
}
