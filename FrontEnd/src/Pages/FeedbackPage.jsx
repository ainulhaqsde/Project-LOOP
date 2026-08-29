import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    message: "",
    source: "website",
  });

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // FETCH FEEDBACK
  // =====================================================

  const fetchFeedbacks = async () => {
    try {
      setFetching(true);
      setError("");

      const data = await api("/feedback");

      console.log("Feedback response:", data);

      if (data.status === 401 || data.sessionExpired) {
        setError("Your session has expired. Please login again.");
        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message || "Failed to fetch feedback."
        );
      }

      setFeedbacks(
        Array.isArray(data.feedbacks)
          ? data.feedbacks
          : []
      );
    } catch (error) {
      console.error("Fetch feedback error:", error);

      setError(
        error.message || "Unable to load feedback."
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerEmail: "",
      message: "",
      source: "website",
    });

    setEditingId(null);
  };

  // =====================================================
  // EDIT FEEDBACK
  // =====================================================

  const handleEdit = (feedback) => {
    setMessage("");
    setError("");

    setEditingId(feedback._id);

    setFormData({
      customerName: feedback.customerName || "",
      customerEmail: feedback.customerEmail || "",
      message: feedback.message || "",
      source: feedback.source || "website",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // SUBMIT / UPDATE FEEDBACK
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");

    if (!formData.customerName.trim()) {
      setError("Customer name is required.");
      return;
    }

    if (!formData.customerEmail.trim()) {
      setError("Customer email is required.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Feedback message is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        message: formData.message.trim(),
        source: formData.source,
      };

      let data;

      if (editingId) {
        data = await api(
          `/feedback/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        console.log(
          "Update feedback response:",
          data
        );

        if (data.status === 401 || data.sessionExpired) {
          setError(
            "Your session has expired. Please login again."
          );
          return;
        }

        if (!data.ok || data.success === false) {
          throw new Error(
            data.message ||
              "Failed to update feedback."
          );
        }

        setMessage(
          "Feedback updated successfully. AI analysis has been refreshed if the message changed."
        );
      } else {
        data = await api(
          "/feedback",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        console.log(
          "Create feedback response:",
          data
        );

        if (data.status === 401 || data.sessionExpired) {
          setError(
            "Your session has expired. Please login again."
          );
          return;
        }

        if (!data.ok || data.success === false) {
          throw new Error(
            data.message ||
              "Failed to submit feedback."
          );
        }

        setMessage(
          "Feedback submitted successfully. AI analysis has been completed."
        );
      }

      resetForm();

      await fetchFeedbacks();
    } catch (error) {
      console.error(
        "Feedback submit/update error:",
        error
      );

      setError(
        error.message ||
          "Unable to save feedback."
      );
    } finally {
      setLoading(false);
    }
  };

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
      setMessage("");
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

      if (data.status === 401 || data.sessionExpired) {
        setError(
          "Your session has expired. Please login again."
        );
        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Failed to delete feedback."
        );
      }

      setMessage(
        "Feedback deleted successfully."
      );

      if (editingId === id) {
        resetForm();
      }

      await fetchFeedbacks();
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
      return "bg-green-500/10 text-green-400 border-green-500/20";
    }

    if (sentiment === "negative") {
      return "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  // =====================================================
  // FILTER FEEDBACK
  // =====================================================

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      const search =
        searchTerm.trim().toLowerCase();

      const matchesSearch =
        !search ||
        feedback.customerName
          ?.toLowerCase()
          .includes(search) ||
        feedback.customerEmail
          ?.toLowerCase()
          .includes(search) ||
        feedback.message
          ?.toLowerCase()
          .includes(search) ||
        feedback.summary
          ?.toLowerCase()
          .includes(search) ||
        feedback.keyIssue
          ?.toLowerCase()
          .includes(search) ||
        (Array.isArray(feedback.themes) &&
          feedback.themes.some((theme) =>
            theme
              ?.toLowerCase()
              .includes(search)
          ));

      const matchesSentiment =
        sentimentFilter === "all" ||
        feedback.sentiment === sentimentFilter;

      const matchesSource =
        sourceFilter === "all" ||
        feedback.source === sourceFilter;

      return (
        matchesSearch &&
        matchesSentiment &&
        matchesSource
      );
    });
  }, [
    feedbacks,
    searchTerm,
    sentimentFilter,
    sourceFilter,
  ]);

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
            Project LOOP
          </p>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold sm:text-4xl">
                Customer Feedback
              </h1>

              <p className="mt-3 max-w-2xl text-gray-400">
                Manage, search, edit and analyze your
                customer feedback with AI-powered insights.
              </p>
            </div>

            <button
              type="button"
              onClick={fetchFeedbacks}
              disabled={fetching}
              className="w-fit rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-medium text-gray-200 transition hover:border-blue-500 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {fetching
                ? "Refreshing..."
                : "Refresh Feedback"}
            </button>
          </div>
        </div>

        {/* MESSAGES */}

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

        {/* FORM */}

        <div className="mb-10 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">

          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                {editingId
                  ? "Edit Feedback"
                  : "Submit Feedback"}
              </h2>

              <p className="mt-2 text-sm text-gray-400">
                {editingId
                  ? "Update the feedback below. If the message changes, Project LOOP will run AI analysis again."
                  : "Submit customer feedback and automatically analyze it using Project LOOP AI."}
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-fit rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:bg-gray-800"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* CUSTOMER NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter customer name"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* CUSTOMER EMAIL */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Customer Email
                </label>

                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter customer email"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* SOURCE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Feedback Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="website">
                    Website
                  </option>

                  <option value="manual">
                    Manual
                  </option>

                  <option value="survey">
                    Survey
                  </option>

                  <option value="email">
                    Email
                  </option>
                </select>
              </div>

            </div>

            {/* MESSAGE */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Feedback
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Enter customer feedback..."
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 leading-7 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* BUTTON */}

            <div className="mt-7 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? editingId
                    ? "Updating & Analyzing..."
                    : "Analyzing..."
                  : editingId
                  ? "Update Feedback"
                  : "Submit Feedback"}
              </button>
            </div>

          </form>
        </div>

        {/* FILTERS */}

        <div className="mb-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

          <div className="mb-5">
            <h2 className="text-xl font-semibold">
              Find Feedback
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Search by customer, message, theme or AI analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {/* SEARCH */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Search
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search feedback..."
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* SENTIMENT */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Sentiment
              </label>

              <select
                value={sentimentFilter}
                onChange={(event) =>
                  setSentimentFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                <option value="all">
                  All Sentiments
                </option>

                <option value="positive">
                  Positive
                </option>

                <option value="negative">
                  Negative
                </option>

                <option value="neutral">
                  Neutral
                </option>
              </select>
            </div>

            {/* SOURCE */}

            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Source
              </label>

              <select
                value={sourceFilter}
                onChange={(event) =>
                  setSourceFilter(event.target.value)
                }
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-sm text-white outline-none transition focus:border-blue-500"
              >
                <option value="all">
                  All Sources
                </option>

                <option value="website">
                  Website
                </option>

                <option value="manual">
                  Manual
                </option>

                <option value="survey">
                  Survey
                </option>

                <option value="email">
                  Email
                </option>
              </select>
            </div>

          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-500">
              Showing{" "}
              <span className="font-semibold text-gray-300">
                {filteredFeedbacks.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-300">
                {feedbacks.length}
              </span>{" "}
              feedback entries
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSentimentFilter("all");
                setSourceFilter("all");
              }}
              className="w-fit rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-400 transition hover:bg-gray-800 hover:text-white"
            >
              Clear Filters
            </button>
          </div>

        </div>

        {/* FEEDBACK LIST */}

        <div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold">
              Feedback History
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Customer feedback and AI-generated insights.
            </p>
          </div>

          {fetching ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-blue-500" />

              <p className="text-gray-400">
                Loading feedback...
              </p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">
              <p className="text-lg font-semibold text-gray-300">
                No feedback available
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Add your first customer feedback above.
              </p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-12 text-center">
              <p className="text-lg font-semibold text-gray-300">
                No matching feedback
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {filteredFeedbacks.map((feedback) => (

                <div
                  key={feedback._id}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg transition hover:border-gray-700 sm:p-7"
                >

                  {/* TOP */}

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-white">
                        {feedback.customerName}
                      </h3>

                      {feedback.customerEmail && (
                        <p className="mt-1 text-sm text-gray-500">
                          {feedback.customerEmail}
                        </p>
                      )}

                      {feedback.source && (
                        <p className="mt-2 text-xs capitalize text-gray-600">
                          Source: {feedback.source}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize ${getSentimentStyle(
                          feedback.sentiment
                        )}`}
                      >
                        {feedback.sentiment || "unknown"}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(feedback)
                        }
                        className="rounded-lg border border-blue-500/20 px-3 py-1.5 text-xs font-medium text-blue-400 transition hover:bg-blue-500/10"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(feedback._id)
                        }
                        disabled={
                          deletingId === feedback._id
                        }
                        className="rounded-lg border border-red-500/20 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingId === feedback._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                  {/* ORIGINAL FEEDBACK */}

                  <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950 p-5">

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Customer Feedback
                    </p>

                    <p className="leading-7 text-gray-300">
                      {feedback.message}
                    </p>

                  </div>

                  {/* AI ANALYSIS */}

                  <div className="mt-6">

                    <div className="mb-5 flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 font-bold text-blue-400">
                        AI
                      </div>

                      <div>
                        <h4 className="font-semibold text-white">
                          AI Analysis
                        </h4>

                        <p className="text-xs text-gray-500">
                          Generated by Project LOOP AI
                        </p>
                      </div>

                    </div>

                    {/* THEMES */}

                    {Array.isArray(feedback.themes) &&
                      feedback.themes.length > 0 && (
                        <div className="mb-5">

                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                            Main Themes
                          </p>

                          <div className="flex flex-wrap gap-2">

                            {feedback.themes.map(
                              (theme, index) => (
                                <span
                                  key={index}
                                  className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs text-blue-400"
                                >
                                  {theme}
                                </span>
                              )
                            )}

                          </div>

                        </div>
                      )}

                    {/* SUMMARY */}

                    {feedback.summary && (
                      <div className="mb-5">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Summary
                        </p>

                        <p className="leading-7 text-gray-300">
                          {feedback.summary}
                        </p>

                      </div>
                    )}

                    {/* KEY ISSUE */}

                    {feedback.keyIssue && (
                      <div className="mb-5">

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Key Issue
                        </p>

                        <p className="leading-7 text-gray-300">
                          {feedback.keyIssue}
                        </p>

                      </div>
                    )}

                    {/* RECOMMENDATION */}

                    {feedback.recommendation && (
                      <div>

                        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                          Recommendation
                        </p>

                        <p className="leading-7 text-gray-300">
                          {feedback.recommendation}
                        </p>

                      </div>
                    )}

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

        <div className="h-12" />

      </div>
    </div>
  );
}

export default FeedbackPage;