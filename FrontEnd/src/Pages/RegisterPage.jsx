import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =====================================================
  // REGISTER
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    // =================================================
    // FRONTEND VALIDATION
    // =================================================

    if (!formData.name.trim()) {
      setError("Name is required.");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      // =================================================
      // SEND REGISTER REQUEST
      // =================================================

      const data = await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });

      // =================================================
      // CHECK API RESPONSE
      // =================================================

      if (!data || data.success === false) {
        setError(data?.message || "Registration failed.");
        return;
      }

      // =================================================
      // REGISTRATION SUCCESSFUL
      // =================================================

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      // Clear form

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // =================================================
      // REDIRECT TO LOGIN
      // =================================================

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        error?.message ||
          "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Create Your Account
          </h1>

          <p className="mt-2 text-gray-400">
            Join Project LOOP
          </p>
        </div>

        {/* =================================================
            FORM CARD
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl"
        >

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* =================================================
              SUCCESS
          ================================================= */}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              {success}
            </div>
          )}

          {/* =================================================
              NAME
          ================================================= */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-200"
            >
              Full Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              autoComplete="name"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-200"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />

            <p className="text-xs text-gray-500">
              Password must contain at least 6 characters.
            </p>
          </div>

          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="flex flex-col gap-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-200"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-lg bg-blue-600 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
          >
            {loading
              ? "Creating Account..."
              : "Create Account"}
          </button>

          {/* =================================================
              LOGIN
          ================================================= */}

          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-400">
              Already have an account?

              <Link
                to="/login"
                className="ml-2 font-medium text-blue-400 hover:text-blue-300"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>

        {/* =================================================
            SECURITY MESSAGE
        ================================================= */}

        <p className="mt-6 text-center text-xs text-gray-600">
          Your account is protected with secure authentication.
        </p>

      </div>
    </div>
  );
}

export default RegisterPage;