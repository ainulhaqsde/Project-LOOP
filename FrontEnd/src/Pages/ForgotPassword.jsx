import React, { useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";


function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const data = await api(
        "/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({
            email,
          }),
        }
      );


      if (!data.success) {
        setError(
          data.message ||
            "Unable to process password reset request."
        );

        return;
      }


      setMessage(
        data.message ||
          "If an account exists for that email, a password reset link has been created."
      );

    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      setError(
        error.message ||
          "Unable to connect to the server."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 py-16 text-white">

      <div className="w-full max-w-md">

        <div className="mb-10 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Project LOOP
          </p>

          <h1 className="text-4xl font-bold">
            Forgot Password
          </h1>

          <p className="mt-3 text-gray-400">
            Enter your registered email address to reset your password.
          </p>

        </div>


        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}


            {message && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                {message}
              </div>
            )}


            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>


            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
            >
              {loading
                ? "Processing..."
                : "Send Reset Link"}
            </button>

          </form>


          <div className="mt-8 border-t border-gray-800 pt-6 text-center">

            <Link
              to="/login"
              className="font-medium text-blue-400 transition hover:text-blue-300"
            >
              Back to Sign In
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}


export default ForgotPasswordPage;