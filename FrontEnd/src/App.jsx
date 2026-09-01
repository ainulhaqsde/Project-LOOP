import React from "react";
import { Routes, Route } from "react-router-dom";

// =====================================================
// COMPONENTS
// =====================================================

import Navbar from "./Components/Navbar";
import ProtectedRoute from "./Components/ProtectedRoute";

// =====================================================
// PUBLIC PAGES
// =====================================================

import WelcomePage from "./Pages/WelcomePage";
import InfoPage from "./Pages/InfoPage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import ForgotPasswordPage from "./Pages/ForgotPassword";
import ResetPasswordPage from "./Pages/ResetPassword";

// =====================================================
// PROTECTED PAGES
// =====================================================

import DashboardPage from "./Pages/Dashboard";
import FeedbackPage from "./Pages/FeedbackPage";
import AddFeedbackPage from "./Pages/AddFeedbackPage";
import EditFeedbackPage from "./Pages/EditFeedbackPage";
import AskAIPage from "./Pages/AskAI";
import AnalyticsPage from "./Pages/AnalyticsPage";
import VoCReportPage from "./Pages/VoCReport";

// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./Pages/AdminDashboard";
import AdminUsersPage from "./Pages/AdminUsersPage";
import AdminPage from "./Pages/AdminPage";

// =====================================================
// APP
// =====================================================

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<WelcomePage />}
        />

        <Route
          path="/info"
          element={<InfoPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/register"
          element={<RegisterPage />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPasswordPage />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        />


        {/* =================================================
            PROTECTED USER ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/feedback"
            element={<FeedbackPage />}
          />

          <Route
            path="/add-feedback"
            element={<AddFeedbackPage />}
          />

          <Route
            path="/edit-feedback/:id"
            element={<EditFeedbackPage />}
          />

          <Route
            path="/ask-ai"
            element={<AskAIPage />}
          />

          <Route
            path="/analytics"
            element={<AnalyticsPage />}
          />

          <Route
            path="/voc-report"
            element={<VoCReportPage />}
          />

        </Route>


        {/* =================================================
            ADMIN ROUTES
        ================================================= */}

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["admin"]}
            />
          }
        >

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/page"
            element={<AdminPage />}
          />

          <Route
            path="/admin/users"
            element={<AdminUsersPage />}
          />

          <Route
            path="/admin/feedback"
            element={<FeedbackPage />}
          />

        </Route>


        {/* =================================================
            FALLBACK
        ================================================= */}

        <Route
          path="*"
          element={<WelcomePage />}
        />

      </Routes>
    </>
  );
}

export default App;