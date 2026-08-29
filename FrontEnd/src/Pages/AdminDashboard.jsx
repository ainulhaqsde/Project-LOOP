import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    managerUsers: 0,
    memberUsers: 0,
    totalFeedback: 0,
    positiveFeedback: 0,
    negativeFeedback: 0,
    neutralFeedback: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ADMIN DATA
  // =====================================================

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/admin/stats");

      console.log("Admin dashboard response:", data);

      // ---------------------------------------------------
      // SESSION EXPIRED
      // ---------------------------------------------------

      if (data.status === 401 || data.sessionExpired) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // ---------------------------------------------------
      // ACCESS DENIED
      // ---------------------------------------------------

      if (data.status === 403) {
        setError(
          "You do not have permission to access the admin dashboard."
        );

        return;
      }

      // ---------------------------------------------------
      // OTHER API ERROR
      // ---------------------------------------------------

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to load admin dashboard."
        );
      }

      // ---------------------------------------------------
      // BACKEND RETURNS:
      //
      // {
      //   success: true,
      //   stats: {
      //     totalUsers,
      //     adminUsers,
      //     managerUsers,
      //     memberUsers,
      //     totalFeedback,
      //     positiveFeedback,
      //     negativeFeedback,
      //     neutralFeedback
      //   }
      // }
      // ---------------------------------------------------

      const adminData = data.stats || {};

      setStats({
        totalUsers: adminData.totalUsers || 0,
        adminUsers: adminData.adminUsers || 0,
        managerUsers: adminData.managerUsers || 0,
        memberUsers: adminData.memberUsers || 0,

        totalFeedback:
          adminData.totalFeedback || 0,

        positiveFeedback:
          adminData.positiveFeedback || 0,

        negativeFeedback:
          adminData.negativeFeedback || 0,

        neutralFeedback:
          adminData.neutralFeedback || 0,
      });
    } catch (error) {
      console.error(
        "Admin dashboard error:",
        error
      );

      setError(
        error.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAdminData();
  }, []);

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 text-gray-500">
              Loading platform administration data...
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-gray-800 bg-gray-900"
              />
            ))}

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Manage users, monitor feedback activity,
              and oversee the Project LOOP platform.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchAdminData}
            className="w-fit rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
          >
            Refresh
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-5">

            <p className="font-semibold text-red-400">
              Admin Dashboard Error
            </p>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchAdminData}
              className="mt-4 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Try Again
            </button>

          </div>
        )}


        {/* =================================================
            USER STATISTICS
        ================================================= */}

        <div className="mb-8">

          <div className="mb-5">

            <h2 className="text-2xl font-semibold">
              User Overview
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Current Project LOOP user distribution.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL USERS */}

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Total Users
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-400">
                {stats.totalUsers}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Registered platform users
              </p>

            </div>


            {/* ADMINS */}

            <div className="rounded-2xl border border-purple-500/20 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Administrators
              </p>

              <p className="mt-3 text-4xl font-bold text-purple-400">
                {stats.adminUsers}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Users with admin access
              </p>

            </div>


            {/* MANAGERS */}

            <div className="rounded-2xl border border-blue-500/20 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Managers
              </p>

              <p className="mt-3 text-4xl font-bold text-blue-400">
                {stats.managerUsers}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Users with manager access
              </p>

            </div>


            {/* MEMBERS */}

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Members
              </p>

              <p className="mt-3 text-4xl font-bold text-gray-300">
                {stats.memberUsers}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Regular platform users
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            FEEDBACK STATISTICS
        ================================================= */}

        <div className="mb-8">

          <div className="mb-5">

            <h2 className="text-2xl font-semibold">
              Feedback Overview
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Current customer feedback sentiment across
              Project LOOP.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">

            {/* TOTAL FEEDBACK */}

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Total Feedback
              </p>

              <p className="mt-3 text-4xl font-bold">
                {stats.totalFeedback}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Feedback entries collected
              </p>

            </div>


            {/* POSITIVE */}

            <div className="rounded-2xl border border-green-500/20 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Positive Feedback
              </p>

              <p className="mt-3 text-4xl font-bold text-green-400">
                {stats.positiveFeedback}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Positive customer sentiment
              </p>

            </div>


            {/* NEGATIVE */}

            <div className="rounded-2xl border border-red-500/20 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Negative Feedback
              </p>

              <p className="mt-3 text-4xl font-bold text-red-400">
                {stats.negativeFeedback}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Negative customer sentiment
              </p>

            </div>


            {/* NEUTRAL */}

            <div className="rounded-2xl border border-yellow-500/20 bg-gray-900 p-6 shadow-lg">

              <p className="text-sm text-gray-500">
                Neutral Feedback
              </p>

              <p className="mt-3 text-4xl font-bold text-yellow-400">
                {stats.neutralFeedback}
              </p>

              <p className="mt-2 text-xs text-gray-600">
                Neutral customer sentiment
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            ADMIN ACTIONS
        ================================================= */}

        <div className="mt-10 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-semibold">
              Administration
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage the most important parts of Project LOOP.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            {/* MANAGE USERS */}

            <button
              type="button"
              onClick={() => navigate("/admin")}
              className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-purple-500/40 hover:bg-purple-500/5"
            >

              <p className="font-semibold text-white">
                Manage Users
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                View users and manage their platform roles
                and access.
              </p>

            </button>


            {/* FEEDBACK */}

            <button
              type="button"
              onClick={() => navigate("/feedback")}
              className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-blue-500/40 hover:bg-blue-500/5"
            >

              <p className="font-semibold text-white">
                View Feedback
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Review customer feedback and AI analysis.
              </p>

            </button>


            {/* ANALYTICS */}

            <button
              type="button"
              onClick={() => navigate("/analytics")}
              className="rounded-xl border border-gray-800 bg-gray-950 p-5 text-left transition hover:border-green-500/40 hover:bg-green-500/5"
            >

              <p className="font-semibold text-white">
                View Analytics
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Analyze customer sentiment and recurring
                themes.
              </p>

            </button>


            {/* ASK AI */}

            <button
              type="button"
              onClick={() => navigate("/ask-ai")}
              className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-5 text-left transition hover:bg-blue-500/10"
            >

              <p className="font-semibold text-blue-400">
                Ask LOOP AI
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Ask questions about customer feedback using
                Project LOOP AI.
              </p>

            </button>

          </div>

        </div>


        {/* =================================================
            BOTTOM SPACING
        ================================================= */}

        <div className="h-16" />

      </div>
    </div>
  );
}

export default AdminDashboard;

