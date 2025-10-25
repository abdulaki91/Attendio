import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useCreateResource from "../hooks/useCreateResource";

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  // const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { mutate: createUser, isLoading: loading } = useCreateResource(
    "users/create-user",
    "users"
  );
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    createUser(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      },
      {
        onSuccess: () => navigate("/check-email"), // remove setTimeout
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-300 text-gray-700">
      <div className="card w-full max-w-lg shadow-2xl bg-white p-8 rounded-xl transform transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-purple-800">
          Create Your Account
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Join us today! Fill out the form below to get started.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Full Name
              </span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="input input-bordered w-full rounded-lg bg-gray-50 border text-gray-700 border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Email Address
              </span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="input input-bordered w-full rounded-lg text-gray-700 bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
              required
            />
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input input-bordered w-full pr-12 rounded-lg text-gray-700 bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-purple-600 focus:outline-none"
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text font-semibold text-gray-700">
                Confirm Password
              </span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="input input-bordered w-full pr-12 rounded-lg text-gray-700 bg-gray-50 border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Signup Button */}
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn w-full text-lg font-bold py-3 rounded-lg bg-purple-600 border-none text-white hover:bg-purple-700 transition-colors transform hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm text-base-100"></span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="link link-primary font-bold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
}
