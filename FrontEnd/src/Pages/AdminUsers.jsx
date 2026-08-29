import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminUsersPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] =
    useState("all");

  const [actionLoading, setActionLoading] =
    useState("");

  // =====================================================
  // FETCH USERS
  // =====================================================

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/admin/users");

      console.log(
        "Admin users response:",
        data
      );

      if (
        data.status === 401 ||
        data.status === 403
      ) {
        setError(
          "You do not have permission to manage users."
        );

        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to load users."
        );
      }

      setUsers(
        Array.isArray(data.users)
          ? data.users
          : []
      );

    } catch (error) {
      console.error(
        "Admin users error:",
        error
      );

      setError(
        error.message ||
          "Unable to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =====================================================
  // FILTER USERS
  // =====================================================

  const filteredUsers = useMemo(() => {
    const cleanSearch =
      search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !cleanSearch ||
        user?.name
          ?.toLowerCase()
          .includes(cleanSearch) ||
        user?.email
          ?.toLowerCase()
          .includes(cleanSearch);

      const matchesRole =
        roleFilter === "all" ||
        user?.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [users, search, roleFilter]);

  // =====================================================
  // COUNTS
  // =====================================================

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) => user.role === "admin"
  ).length;

  const managerUsers = users.filter(
    (user) => user.role === "manager"
  ).length;

  const memberUsers = users.filter(
    (user) =>
      !user.role ||
      user.role === "member"
  ).length;

  // =====================================================
  // UPDATE ROLE
  // =====================================================

  const handleRoleChange = async (
    userId,
    newRole
  ) => {
    try {
      setActionLoading(userId);
      setError("");

      const response = await api(
        `/admin/users/${userId}/role`,
        {
          method: "PATCH",

          body: JSON.stringify({
            role: newRole,
          }),
        }
      );

      if (
        !response.ok ||
        response.success === false
      ) {
        throw new Error(
          response.message ||
            "Unable to update user role."
        );
      }

      setUsers((previous) =>
        previous.map((user) =>
          user._id === userId
            ? {
                ...user,
                role: newRole,
              }
            : user
        )
      );

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
      setActionLoading("");
    }
  };

  // =====================================================
  // DELETE USER
  // =====================================================

  const handleDeleteUser = async (
    userId,
    userName
  ) => {
    const confirmed =
      window.confirm(
        `Are you sure you want to delete ${userName || "this user"}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(userId);
      setError("");

      const response = await api(
        `/admin/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (
        !response.ok ||
        response.success === false
      ) {
        throw new Error(
          response.message ||
            "Unable to delete user."
        );
      }

      setUsers((previous) =>
        previous.filter(
          (user) =>
            user._id !== userId
        )
      );

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
      setActionLoading("");
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

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
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-red-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              User Management
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Manage registered users, roles,
              and access permissions.
            </p>

          </div>

          <button
            type="button"
            onClick={fetchUsers}
            className="w-fit rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500 hover:text-blue-400"
          >
            Refresh Users
          </button>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Total Users
            </p>

            <p className="mt-3 text-3xl font-bold">
              {totalUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Administrators
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {adminUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Managers
            </p>

            <p className="mt-3 text-3xl font-bold text-blue-400">
              {managerUsers}
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Members
            </p>

            <p className="mt-3 text-3xl font-bold text-green-400">
              {memberUsers}
            </p>
          </div>

        </div>


        {/* =================================================
            MANAGEMENT PANEL
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

          <div className="mb-6 flex flex-col gap-4 lg:flex-row">

            {/* SEARCH */}

            <div className="flex-1">

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Search Users
              </label>

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500"
              />

            </div>


            {/* ROLE FILTER */}

            <div className="w-full lg:w-52">

              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Filter by Role
              </label>

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-gray-300 outline-none focus:border-blue-500"
              >

                <option value="all">
                  All Roles
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="manager">
                  Manager
                </option>

                <option value="member">
                  Member
                </option>

              </select>

            </div>

          </div>


          {/* RESULT COUNT */}

          <div className="mb-4 text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-300">
              {filteredUsers.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-300">
              {users.length}
            </span>{" "}
            users
          </div>


          {/* =================================================
              TABLE
          ================================================= */}

          {filteredUsers.length === 0 ? (

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-12 text-center">

              <p className="font-semibold text-gray-400">
                No users found
              </p>

              <p className="mt-2 text-sm text-gray-600">
                Try changing your search or
                role filter.
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

                <thead>

                  <tr className="border-b border-gray-800 text-xs uppercase tracking-wide text-gray-500">

                    <th className="px-4 py-4">
                      User
                    </th>

                    <th className="px-4 py-4">
                      Email
                    </th>

                    <th className="px-4 py-4">
                      Role
                    </th>

                    <th className="px-4 py-4">
                      Joined
                    </th>

                    <th className="px-4 py-4 text-right">
                      Actions
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {filteredUsers.map(
                    (user) => {

                      const isLoading =
                        actionLoading ===
                        user._id;

                      return (
                        <tr
                          key={user._id}
                          className="border-b border-gray-800/70 transition hover:bg-gray-950/60"
                        >

                          <td className="px-4 py-5">

                            <p className="font-semibold text-white">
                              {user.name ||
                                "Unnamed User"}
                            </p>

                            <p className="mt-1 text-xs text-gray-600">
                              {user._id}
                            </p>

                          </td>


                          <td className="px-4 py-5 text-sm text-gray-400">
                            {user.email ||
                              "No email"}
                          </td>


                          <td className="px-4 py-5">

                            <select
                              value={
                                user.role ||
                                "member"
                              }
                              disabled={
                                isLoading
                              }
                              onChange={(
                                event
                              ) =>
                                handleRoleChange(
                                  user._id,
                                  event.target.value
                                )
                              }
                              className="rounded-lg border border-gray-700 bg-gray-950 px-3 py-2 text-sm text-gray-300 outline-none focus:border-blue-500 disabled:opacity-50"
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

                          </td>


                          <td className="px-4 py-5 text-sm text-gray-500">

                            {user.createdAt
                              ? new Date(
                                  user.createdAt
                                ).toLocaleDateString()
                              : "N/A"}

                          </td>


                          <td className="px-4 py-5 text-right">

                            <button
                              type="button"
                              disabled={
                                isLoading
                              }
                              onClick={() =>
                                handleDeleteUser(
                                  user._id,
                                  user.name
                                )
                              }
                              className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              {isLoading
                                ? "Processing..."
                                : "Delete"}
                            </button>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>


        {/* =================================================
            BACK
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mt-6 rounded-xl border border-gray-800 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-400 transition hover:border-blue-500 hover:text-blue-400"
        >
          ← Back to Admin Dashboard
        </button>

        <div className="h-16" />

      </div>

    </div>
  );
}

export default AdminUsersPage;