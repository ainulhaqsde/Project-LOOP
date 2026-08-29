import React from "react";
import { Link, useLocation } from "react-router-dom";

function DashboardSidebar() {

  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="hidden md:flex w-64 min-h-screen bg-gray-900 border-r border-gray-800 flex-col px-5 py-8">

      {/* Logo */}
      <div className="px-3 mb-10">

        <Link
          to="/dashboard"
          className="text-2xl font-bold text-blue-500"
        >
          Project LOOP
        </Link>

        <p className="text-sm text-gray-500 mt-2">
          Customer Intelligence
        </p>

      </div>


      {/* Navigation */}
      <nav className="flex flex-col gap-2">

        <Link
          to="/dashboard"
          className={`px-4 py-3 rounded-lg transition ${
            isActive("/dashboard")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Dashboard
        </Link>


        <Link
          to="/feedback"
          className={`px-4 py-3 rounded-lg transition ${
            isActive("/feedback")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Feedback
        </Link>


        <Link
          to="/analytics"
          className={`px-4 py-3 rounded-lg transition ${
            isActive("/analytics")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Analytics
        </Link>


        <Link
          to="/reports"
          className={`px-4 py-3 rounded-lg transition ${
            isActive("/reports")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          Reports
        </Link>


        <Link
          to="/ai-assistant"
          className={`px-4 py-3 rounded-lg transition ${
            isActive("/ai-assistant")
              ? "bg-blue-600 text-white"
              : "text-gray-400 hover:bg-gray-800 hover:text-white"
          }`}
        >
          AI Assistant
        </Link>

      </nav>


      {/* Bottom Navigation */}
      <div className="mt-auto pt-6 border-t border-gray-800">

        <Link
          to="/"
          className="block px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition"
        >
          Back to Home
        </Link>

      </div>

    </aside>
  );
}

export default DashboardSidebar;