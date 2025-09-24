import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data); // wait for API call
      navigate("/dashboard"); // redirect if needed
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // always turn it off
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="card w-full max-w-md shadow-2xl bg-white p-8 rounded-xl transform transition-transform duration-300 ">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Please log in to your account.
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Email Address
              </span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered w-full rounded-lg bg-gray-50 border text-gray-700 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-12 rounded-lg text-gray-700 bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                {...register("password", { required: "Password is required" })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff size={22} strokeWidth={2} />
                ) : (
                  <Eye size={22} strokeWidth={2} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end text-sm mb-6">
            <Link
              to="#"
              className="link link-hover text-blue-600 hover:text-blue-800 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full text-lg font-bold py-3 rounded-lg bg-blue-600 text-white border-none hover:bg-blue-700 transition-colors transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm text-base-100"></span>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="link link-primary font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            {" "}
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
