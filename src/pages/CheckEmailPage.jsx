import { Link } from "react-router-dom";

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-300 text-gray-700 p-4">
      <div className="card w-full max-w-md shadow-2xl bg-white p-8 rounded-xl text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-4">
          Check Your Email
        </h1>
        <p className="text-gray-600 mb-6">
          We have sent a verification link to your email. Please check your
          inbox and click the link to activate your account.
        </p>
        <Link
          to="/login"
          className="btn w-full bg-purple-600 text-white hover:bg-purple-700 transition-colors rounded-lg"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
}
