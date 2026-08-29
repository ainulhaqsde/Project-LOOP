import React, {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:5000";

// =====================================================
// ADMIN PAGE
// =====================================================

function AdminPage() {
  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

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

  const [users, setUsers] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ===================================================
  // GET AUTH HEADERS
  // ===================================================

  const getHeaders = () => {
    const token =
      localStorage.getItem("token");

    return {
      "Content-Type": "application/json",
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),
    };
  };

  // ===================================================
  // LOAD ADMIN DATA
  // ===================================================

  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = getHeaders();

      const [
        statsResponse,
        usersResponse,
        feedbackResponse,
      ] = await Promise.all([
        fetch(
          `${API_BASE_URL}/admin/stats`,
          {
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/admin/users`,
          {
            headers,
          }
        ),

        fetch(
          `${API_BASE_URL}/admin/feedback`,
          {
            headers,
          }
        ),
      ]);

      const statsData =
        await statsResponse.json();

      const usersData =
        await usersResponse.json();

      const feedbackData =
        await feedbackResponse.json();

      // -------------------------------------------------
      // AUTHORIZATION ERROR
      // -------------------------------------------------

      if (
        statsResponse.status === 401 ||
        statsResponse.status === 403 ||
        usersResponse.status === 401 ||
        usersResponse.status === 403 ||
        feedbackResponse.status === 401 ||
        feedbackResponse.status === 403
      ) {
        throw new Error(
          "You do not have permission to access the admin panel."
        );
      }

      if (!statsResponse.ok) {
        throw new Error(
          statsData.message ||
            "Unable to load admin statistics."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message ||
            "Unable to load users."
        );
      }

      if (!feedbackResponse.ok) {
        throw new Error(
          feedbackData.message ||
            "Unable to load feedback."
        );
      }

      setStats(
        statsData.stats || {}
      );

      setUsers(
        usersData.users || []
      );

      setFeedback(
        feedbackData.feedback || []
      );
    } catch (error) {
      console.error(
        "Admin data error:",
        error
      );

      setError(
        error.message ||
          "Unable to load admin data."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    loadAdminData();
  }, []);

  // ===================================================
  // UPDATE USER ROLE
  // ===================================================

  const handleRoleChange = async (
    userId,
    role
  ) => {
    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}/role`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            role,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update user role."
        );
      }

      setMessage(
        "User role updated successfully."
      );

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user
        )
      );

      await loadAdminData();
    } catch (error) {
      console.error(
        "Role update error:",
        error
      );

      setError(
        error.message ||
          "Unable to update user role."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ===================================================
  // DELETE USER
  // ===================================================

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${userName}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/admin/users/${userId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete user."
        );
      }

      setMessage(
        "User deleted successfully."
      );

      await loadAdminData();
    } catch (error) {
      console.error(
        "Delete user error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete user."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ===================================================
  // DELETE FEEDBACK
  // ===================================================

  const handleDeleteFeedback = async (
    feedbackId
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this feedback?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE_URL}/admin/feedback/${feedbackId}`,
        {
          method: "DELETE",
          headers: getHeaders(),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete feedback."
        );
      }

      setMessage(
        "Feedback deleted successfully."
      );

      await loadAdminData();
    } catch (error) {
      console.error(
        "Delete feedback error:",
        error
      );

      setError(
        error.message ||
          "Unable to delete feedback."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ===================================================
  // SENTIMENT STYLE
  // ===================================================

  const getSentimentStyle = (
    sentiment
  ) => {
    if (sentiment === "positive") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (sentiment === "negative") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
  };

  // ===================================================
  // ROLE STYLE
  // ===================================================

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";
    }

    if (role === "manager") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    return "border-gray-700 bg-gray-800 text-gray-400";
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center text-gray-400">
            Loading Admin Panel...
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-purple-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Admin Panel
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Manage users, roles, customer feedback,
              and platform activity from one place.
            </p>
          </div>

          <button
            type="button"
            onClick={loadAdminData}
            disabled={actionLoading}
            className="w-fit rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-purple-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Refresh Data
          </button>

        </div>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* =================================================
            ADMIN STATUS
        ================================================= */}

        <div className="mb-8 rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 font-bold text-purple-400">
              A
            </div>

            <div>
              <h2 className="font-semibold text-white">
                Administrator Access
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                You have administrator permissions for Project LOOP.
              </p>
            </div>

          </div>

        </div>


        {/* =================================================
            USER STATISTICS
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="mt-3 text-3xl font-bold">
              {stats.totalUsers || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Administrators
            </p>

            <p className="mt-3 text-3xl font-bold text-purple-400">
              {stats.adminUsers || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Managers
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {stats.managerUsers || 0}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Members
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-300">
              {stats.memberUsers || 0}
            </p>
          </div>

        </div>


        {/* =================================================
            FEEDBACK STATISTICS
        ================================================= */}

        <div className="mb-10">

          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Feedback Overview
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Current customer feedback sentiment across Project LOOP.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
              <p className="text-sm text-gray-500">
                Total Feedback
              </p>

              <p className="mt-3 text-3xl font-bold">
                {stats.totalFeedback || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-green-500/20 bg-gray-900 p-6">
              <p className="text-sm text-gray-500">
                Positive
              </p>

              <p className="mt-3 text-3xl font-bold text-green-400">
                {stats.positiveFeedback || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-red-500/20 bg-gray-900 p-6">
              <p className="text-sm text-gray-500">
                Negative
              </p>

              <p className="mt-3 text-3xl font-bold text-red-400">
                {stats.negativeFeedback || 0}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/20 bg-gray-900 p-6">
              <p className="text-sm text-gray-500">
                Neutral
              </p>

              <p className="mt-3 text-3xl font-bold text-yellow-400">
                {stats.neutralFeedback || 0}
              </p>
            </div>

          </div>

        </div>


        {/* =================================================
            USER MANAGEMENT
        ================================================= */}

        <div className="mb-10">

          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-semibold">
                User Management
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Manage Project LOOP users and their permissions.
              </p>
            </div>

            <span className="text-sm text-gray-600">
              {users.length} user{users.length !== 1 ? "s" : ""}
            </span>

          </div>


          <div className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-900">

            {users.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[750px]">

                  <thead className="border-b border-gray-800 bg-gray-950">

                    <tr>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        User
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Joined
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Action
                      </th>

                    </tr>

                  </thead>


                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user._id}
                        className="border-b border-gray-800 last:border-b-0"
                      >

                        <td className="px-6 py-5">

                          <p className="font-semibold text-white">
                            {user.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {user.email}
                          </p>

                        </td>


                        <td className="px-6 py-5">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                            <span
                              className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                                user.role
                              )}`}
                            >
                              {user.role}
                            </span>

                            <select
                              value={user.role}
                              disabled={actionLoading}
                              onChange={(event) =>
                                handleRoleChange(
                                  user._id,
                                  event.target.value
                                )
                              }
                              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-xs text-gray-300 outline-none focus:border-purple-500"
                            >

                              <option value="member">
                                Member
                              </option>

                              <option value="manager">
                                Manager
                              </option>

                              <option value="admin">
                                Admin
                              </option>

                            </select>

                          </div>

                        </td>


                        <td className="px-6 py-5 text-sm text-gray-500">
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "—"}
                        </td>


                        <td className="px-6 py-5 text-right">

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() =>
                              handleDeleteUser(
                                user._id,
                                user.name
                              )
                            }
                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>


        {/* =================================================
            FEEDBACK MANAGEMENT
        ================================================= */}

        <div className="mb-10">

          <div className="mb-5">

            <h2 className="text-2xl font-semibold">
              Feedback Management
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Review and manage customer feedback collected by Project LOOP.
            </p>

          </div>


          <div className="space-y-5">

            {feedback.length === 0 ? (

              <div className="rounded-2xl border border-gray-800 bg-gray-900 p-10 text-center text-gray-500">
                No feedback found.
              </div>

            ) : (

              feedback.map((item) => (

                <div
                  key={item._id}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div>

                      <h3 className="font-semibold text-white">
                        {item.customerName}
                      </h3>

                      {item.customerEmail && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.customerEmail}
                        </p>
                      )}

                    </div>


                    <div className="flex items-center gap-3">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getSentimentStyle(
                          item.sentiment
                        )}`}
                      >
                        {item.sentiment || "unknown"}
                      </span>

                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() =>
                          handleDeleteFeedback(
                            item._id
                          )
                        }
                        className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Delete
                      </button>

                    </div>

                  </div>


                  <div className="mt-5 rounded-xl border border-gray-800 bg-gray-950 p-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                      Customer Feedback
                    </p>

                    <p className="leading-7 text-gray-300">
                      {item.message}
                    </p>

                  </div>


                  {item.summary && (
                    <div className="mt-5">

                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        AI Summary
                      </p>

                      <p className="leading-7 text-gray-400">
                        {item.summary}
                      </p>

                    </div>
                  )}

                </div>

              ))

            )}

          </div>

        </div>


        {/* =================================================
            QUICK NAVIGATION
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

          <button
            type="button"
            onClick={() =>
              navigate("/analytics")
            }
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40"
          >
            <p className="font-semibold">
              Analytics Dashboard
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              View detailed sentiment, themes, and customer trends.
            </p>
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/feedback")
            }
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-green-500/40"
          >
            <p className="font-semibold">
              Customer Feedback
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review all customer feedback and AI analysis.
            </p>
          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/ask-ai")
            }
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-purple-500/40"
          >
            <p className="font-semibold">
              Ask LOOP AI
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ask AI questions about your customer feedback.
            </p>
          </button>

        </div>


        <div className="h-16" />

      </div>
    </div>
  );
}

export default AdminPage;