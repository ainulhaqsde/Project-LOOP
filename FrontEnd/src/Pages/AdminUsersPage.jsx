import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [updatingUser, setUpdatingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  // =====================================================
  // CURRENT USER
  // =====================================================

  const getCurrentUser = () => {
    try {
      return JSON.parse(
        localStorage.getItem("user") || "null"
      );
    } catch {
      return null;
    }
  };

  const currentUser = getCurrentUser();

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await api("/admin/users");

      console.log("Admin users response:", data);

      // -------------------------------------------------
      // AUTHENTICATION
      // -------------------------------------------------

      if (data.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // -------------------------------------------------
      // AUTHORIZATION
      // -------------------------------------------------

      if (data.status === 403) {
        setError(
          "You do not have permission to access this page."
        );

        return;
      }

      // -------------------------------------------------
      // OTHER API ERRORS
      // -------------------------------------------------

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to load users."
        );
      }

      // -------------------------------------------------
      // USERS
      // -------------------------------------------------

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );
    } catch (error) {
      console.error(
        "Fetch users error:",
        error
      );

      setError(
        error.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // UPDATE ROLE
  // =====================================================

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      setUpdatingUser(userId);
      setMessage("");
      setError("");

      const data = await api(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",
          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      // -------------------------------------------------
      // AUTHENTICATION
      // -------------------------------------------------

      if (data.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to update user role."
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setMessage(
        "User role updated successfully."
      );

      await fetchUsers(true);
    } catch (error) {
      console.error(
        "Update role error:",
        error
      );

      setError(
        error.message ||
          "Unable to update user role."
      );
    } finally {
      setUpdatingUser(null);
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDelete = async (user) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingUser(user._id);
      setMessage("");
      setError("");

      const data = await api(
        `/admin/users/${user._id}`,
        {
          method: "DELETE",
        }
      );

      // -------------------------------------------------
      // AUTHENTICATION
      // -------------------------------------------------

      if (data.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login", {
          replace: true,
        });

        return;
      }

      // -------------------------------------------------
      // ERROR
      // -------------------------------------------------

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to delete user."
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setMessage(
        "User deleted successfully."
      );

      await fetchUsers(true);
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
      setDeletingUser(null);
    }
  };

  // =====================================================
  // ROLE STYLE
  // =====================================================

  const getRoleStyle = (role) => {
    if (role === "admin") {
      return "border-purple-500/20 bg-purple-500/10 text-purple-400";
    }

    if (role === "manager") {
      return "border-blue-500/20 bg-blue-500/10 text-blue-400";
    }

    return "border-gray-700 bg-gray-800 text-gray-400";
  };

  // =====================================================
  // LOADING
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
              User Management
            </h1>

            <p className="mt-3 text-gray-400">
              Manage users and workspace roles.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">

            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

            <p className="text-gray-400">
              Loading users...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // UI
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
              User Management
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Manage registered users, assign workspace roles,
              and control access to Project LOOP.
            </p>

          </div>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="w-fit rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing..."
              : "Refresh Users"}
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
            SUMMARY
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="mt-3 text-4xl font-bold">
              {users.length}
            </p>
          </div>

          <div className="rounded-2xl border border-purple-500/20 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Administrators
            </p>

            <p className="mt-3 text-4xl font-bold text-purple-400">
              {
                users.filter(
                  (user) =>
                    user.role === "admin"
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-blue-500/20 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Members & Managers
            </p>

            <p className="mt-3 text-4xl font-bold text-blue-400">
              {
                users.filter(
                  (user) =>
                    user.role !== "admin"
                ).length
              }
            </p>
          </div>

        </div>

        {/* =================================================
            USERS
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 shadow-lg">

          <div className="border-b border-gray-800 p-6 sm:p-7">

            <h2 className="text-xl font-semibold">
              Registered Users
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Manage user access and workspace roles.
            </p>

          </div>

          {users.length === 0 ? (

            <div className="p-10 text-center text-sm text-gray-500">
              No users found.
            </div>

          ) : (

            <div className="divide-y divide-gray-800">

              {users.map((user) => {

                const isCurrentUser =
                  currentUser &&
                  (
                    currentUser._id === user._id ||
                    currentUser.id === user._id
                  );

                return (
                  <div
                    key={user._id}
                    className="p-6 transition hover:bg-gray-900/60 sm:p-7"
                  >

                    <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                      {/* USER INFO */}

                      <div className="min-w-0">

                        <div className="flex flex-wrap items-center gap-3">

                          <h3 className="text-lg font-semibold text-white">
                            {user.name}
                          </h3>

                          <span
                            className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getRoleStyle(
                              user.role
                            )}`}
                          >
                            {user.role}
                          </span>

                          {isCurrentUser && (
                            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                              You
                            </span>
                          )}

                        </div>

                        <p className="mt-2 break-all text-sm text-gray-500">
                          {user.email}
                        </p>

                        <p className="mt-2 text-xs text-gray-600">
                          Joined{" "}
                          {user.createdAt
                            ? new Date(
                                user.createdAt
                              ).toLocaleDateString()
                            : "Unknown"}
                        </p>

                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

                        <select
                          value={user.role}
                          disabled={
                            updatingUser === user._id ||
                            deletingUser === user._id ||
                            isCurrentUser
                          }
                          onChange={(event) =>
                            handleRoleChange(
                              user._id,
                              event.target.value
                            )
                          }
                          className="rounded-xl border border-gray-700 bg-gray-950 px-4 py-2.5 text-sm text-gray-200 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
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

                        <button
                          type="button"
                          disabled={
                            deletingUser === user._id ||
                            updatingUser === user._id ||
                            isCurrentUser
                          }
                          onClick={() =>
                            handleDelete(user)
                          }
                          className="rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {deletingUser === user._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* =================================================
            BACK TO ADMIN
        ================================================= */}

        <div className="mt-6">

          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-purple-500/40 hover:text-purple-400"
          >
            ← Back to Admin Dashboard
          </button>

        </div>

        <div className="h-16" />

      </div>
    </div>
  );
}

export default AdminUsersPage;