import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AdminFeedbackPage() {
  const navigate = useNavigate();

  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/feedback");

      console.log("Admin feedback response:", data);

      if (data.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to load feedback."
        );
      }

      const feedbackData =
        data.feedbacks ||
        data.feedback ||
        data.data ||
        [];

      setFeedbacks(
        Array.isArray(feedbackData)
          ? feedbackData
          : []
      );
    } catch (error) {
      console.error(
        "Admin feedback fetch error:",
        error
      );

      setError(
        error.message ||
          "Unable to load feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // =====================================================
  // DELETE FEEDBACK
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this feedback?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");

      const data = await api(
        `/feedback/${id}`,
        {
          method: "DELETE",
        }
      );

      console.log(
        "Delete feedback response:",
        data
      );

      if (data.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to delete feedback."
        );
      }

      setFeedbacks((previous) =>
        previous.filter(
          (feedback) =>
            feedback._id !== id
        )
      );
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
      setDeletingId(null);
    }
  };

  // =====================================================
  // SENTIMENT STYLE
  // =====================================================

  const getSentimentStyle = (sentiment) => {
    if (sentiment === "positive") {
      return "border-green-500/20 bg-green-500/10 text-green-400";
    }

    if (sentiment === "negative") {
      return "border-red-500/20 bg-red-500/10 text-red-400";
    }

    return "border-yellow-500/20 bg-yellow-500/10 text-yellow-400";
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
              Manage Feedback
            </h1>

            <p className="mt-3 text-gray-400">
              Loading all customer feedback...
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

            <p className="text-gray-400">
              Loading feedback...
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
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP Admin
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage Feedback
            </h1>

            <p className="mt-3 max-w-2xl text-gray-400">
              Review, analyze, edit, and manage customer
              feedback collected across Project LOOP.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() =>
                navigate("/add-feedback")
              }
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Feedback
            </button>

            <button
              type="button"
              onClick={fetchFeedbacks}
              className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
            >
              Refresh
            </button>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">

            <span>
              {error}
            </span>

            {error.includes("session") && (
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="w-fit rounded-lg bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Login Again
              </button>
            )}

          </div>
        )}


        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Total Feedback
            </p>

            <p className="mt-3 text-3xl font-bold">
              {feedbacks.length}
            </p>
          </div>


          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Positive
            </p>

            <p className="mt-3 text-3xl font-bold text-green-400">
              {
                feedbacks.filter(
                  (feedback) =>
                    feedback.sentiment ===
                    "positive"
                ).length
              }
            </p>
          </div>


          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
            <p className="text-sm text-gray-500">
              Negative
            </p>

            <p className="mt-3 text-3xl font-bold text-red-400">
              {
                feedbacks.filter(
                  (feedback) =>
                    feedback.sentiment ===
                    "negative"
                ).length
              }
            </p>
          </div>

        </div>


        {/* =================================================
            FEEDBACK LIST
        ================================================= */}

        {feedbacks.length === 0 ? (

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">

            <p className="text-lg font-semibold text-white">
              No feedback available
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customer feedback will appear here once
              it has been submitted.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/add-feedback")
              }
              className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Add Feedback
            </button>

          </div>

        ) : (

          <div className="space-y-5">

            {feedbacks.map((feedback) => (

              <div
                key={feedback._id}
                className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:border-gray-700 sm:p-7"
              >

                {/* TOP */}

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div className="min-w-0">

                    <h2 className="text-lg font-semibold text-white">
                      {feedback.customerName ||
                        "Anonymous"}
                    </h2>

                    {feedback.customerEmail && (
                      <p className="mt-1 text-sm text-gray-500">
                        {feedback.customerEmail}
                      </p>
                    )}

                    <p className="mt-1 text-xs capitalize text-gray-600">
                      Source:{" "}
                      {feedback.source ||
                        "Unknown"}
                    </p>

                  </div>


                  <span
                    className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getSentimentStyle(
                      feedback.sentiment
                    )}`}
                  >
                    {feedback.sentiment ||
                      "neutral"}
                  </span>

                </div>


                {/* MESSAGE */}

                <div className="mt-5 rounded-xl border border-gray-800 bg-gray-950 p-5">

                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                    Customer Feedback
                  </p>

                  <p className="leading-7 text-gray-300">
                    {feedback.message ||
                      "No feedback message."}
                  </p>

                </div>


                {/* AI ANALYSIS */}

                {(feedback.summary ||
                  feedback.keyIssue ||
                  feedback.recommendation ||
                  feedback.themes?.length > 0) && (

                  <div className="mt-5">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-400">
                        AI
                      </div>

                      <div>
                        <h3 className="font-semibold">
                          AI Analysis
                        </h3>

                        <p className="text-xs text-gray-600">
                          Project LOOP intelligence
                        </p>
                      </div>

                    </div>


                    {feedback.themes?.length > 0 && (
                      <div className="mb-4">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Themes
                        </p>

                        <div className="flex flex-wrap gap-2">

                          {feedback.themes.map(
                            (theme, index) => (
                              <span
                                key={index}
                                className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
                              >
                                {theme}
                              </span>
                            )
                          )}

                        </div>

                      </div>
                    )}


                    {feedback.summary && (
                      <div className="mb-4">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Summary
                        </p>

                        <p className="text-sm leading-6 text-gray-400">
                          {feedback.summary}
                        </p>

                      </div>
                    )}


                    {feedback.keyIssue && (
                      <div className="mb-4">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Key Issue
                        </p>

                        <p className="text-sm leading-6 text-gray-400">
                          {feedback.keyIssue}
                        </p>

                      </div>
                    )}


                    {feedback.recommendation && (
                      <div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                          Recommendation
                        </p>

                        <p className="text-sm leading-6 text-gray-400">
                          {feedback.recommendation}
                        </p>

                      </div>
                    )}

                  </div>
                )}


                {/* ACTIONS */}

                <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-800 pt-5">

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/edit-feedback/${feedback._id}`
                      )
                    }
                    className="rounded-lg border border-gray-700 px-4 py-2 text-sm font-medium text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    disabled={
                      deletingId ===
                      feedback._id
                    }
                    onClick={() =>
                      handleDelete(
                        feedback._id
                      )
                    }
                    className="rounded-lg border border-red-500/20 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {deletingId ===
                    feedback._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        <div className="h-16" />

      </div>
    </div>
  );
}

export default AdminFeedbackPage;