// src/pages/Signin.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useAuth } from "../../Context/ContextProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Signin = () => {
  const axiosSecure = useAxiosSecure();
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosSecure.post("/auth/login", formData);
      await checkAuth();
      toast.success("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-500 to-amber-600">
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Sign In
            </h2>
            <form onSubmit={handleSignin} className="space-y-5">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-orange-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-3 rounded-md hover:bg-orange-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-orange-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
