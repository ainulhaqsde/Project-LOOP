import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import api from "../services/api";


function LoginPage() {
  const navigate = useNavigate();


  // =====================================================
  // STATE
  // =====================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
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
  // LOGIN
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await api(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );


      // =================================================
      // LOGIN FAILED
      // =================================================

      if (!data.success) {
        setError(
          data.message || "Login failed."
        );

        return;
      }


      // =================================================
      // CHECK TOKEN
      // =================================================

      if (!data.token) {
        setError(
          "Login successful, but no authentication token was received."
        );

        return;
      }


      // =================================================
      // SAVE JWT
      // =================================================

      localStorage.setItem(
        "token",
        data.token
      );


      // =================================================
      // GET USER
      // =================================================

      let user = data.user || null;


      // =================================================
      // FALLBACK: READ USER FROM JWT
      // =================================================

      if (!user) {
        try {
          const payload = JSON.parse(
            atob(
              data.token.split(".")[1]
            )
          );

          user = payload;
        } catch (tokenError) {
          console.error(
            "Unable to read user from token:",
            tokenError
          );
        }
      }


      // =================================================
      // SAVE USER
      // =================================================

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }


      // =================================================
      // ROLE-BASED REDIRECT
      // =================================================

      if (user?.role === "admin") {
        navigate("/admin", {
          replace: true,
        });

        return;
      }


      // =================================================
      // MANAGER / MEMBER
      // =================================================

      navigate("/dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
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
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 py-16 text-white">

      <div className="w-full max-w-md">

        {/* =================================================
            HEADING
        ================================================= */}

        <div className="mb-10 text-center">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Project LOOP
          </p>

          <h1 className="text-4xl font-bold">
            Welcome Back
          </h1>

          <p className="mt-3 text-gray-400">
            Sign in to continue to your Project LOOP workspace.
          </p>

        </div>


        {/* =================================================
            LOGIN CARD
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
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
                EMAIL
            ================================================= */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-200"
              >
                Email Address
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
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

            </div>


            {/* =================================================
                REMEMBER + FORGOT
            ================================================= */}

            <div className="flex items-center justify-between text-sm">

              <label className="flex items-center gap-2 text-gray-400">

                <input
                  type="checkbox"
                  className="h-4 w-4"
                />

                Remember me

              </label>

              <button
                type="button"
                className="text-blue-400 transition hover:text-blue-300"
              >
                Forgot password?
              </button>

            </div>


            {/* =================================================
                LOGIN
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3.5 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-900"
            >
              {loading
                ? "Signing in..."
                : "Sign In to LOOP"}
            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-8 border-t border-gray-800 pt-6 text-center">

            <p className="text-gray-400">

              Don't have an account?

              <Link
                to="/register"
                className="ml-2 font-medium text-blue-400 hover:text-blue-300"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>


        {/* =================================================
            SECURITY
        ================================================= */}

        <p className="mt-6 text-center text-xs text-gray-600">
          Your account is protected with secure authentication.
        </p>

      </div>

    </div>
  );
}


export default LoginPage;