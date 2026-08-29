import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddFeedbackPage() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    message: "",
    source: "website",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
  // SUBMIT FEEDBACK
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const customerName = formData.customerName.trim();
    const customerEmail = formData.customerEmail.trim();
    const message = formData.message.trim();

    if (!customerName) {
      setError("Please enter the customer name.");
      return;
    }

    if (!message) {
      setError("Please enter the customer feedback.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName,
        customerEmail,
        message,
        source: formData.source,
      };

      console.log("Submitting feedback:", payload);

      const data = await api("/feedback", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("Add feedback response:", data);

      // -------------------------------------------------
      // AUTHENTICATION ERROR
      // -------------------------------------------------

      if (data.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // -------------------------------------------------
      // API ERROR
      // -------------------------------------------------

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to submit feedback."
        );
      }

      // -------------------------------------------------
      // SUCCESS
      // -------------------------------------------------

      setSuccess(
        "Feedback submitted successfully and AI analysis has been completed."
      );

      setFormData({
        customerName: "",
        customerEmail: "",
        message: "",
        source: "website",
      });

    } catch (error) {
      console.error(
        "Add feedback error:",
        error
      );

      setError(
        error.message ||
          "Unable to submit feedback."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">

      <div className="mx-auto max-w-4xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Project LOOP
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Add Customer Feedback
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Add customer feedback to Project LOOP and let AI
            analyze the sentiment, themes, key issues, and
            recommendations automatically.
          </p>

        </div>


        {/* =================================================
            SUCCESS
        ================================================= */}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400">
            {success}
          </div>
        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-6 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">

            <span>
              {error}
            </span>

            {error.includes("session") && (
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="w-fit rounded-lg bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Login Again
              </button>
            )}

          </div>
        )}


        {/* =================================================
            FORM
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">

          <div className="mb-7">

            <h2 className="text-xl font-semibold">
              Feedback Details
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Enter the customer information and feedback
              below.
            </p>

          </div>


          <form onSubmit={handleSubmit}>

            {/* =================================================
                CUSTOMER INFORMATION
            ================================================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Customer Name */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Customer Name
                </label>

                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                  required
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>


              {/* Customer Email */}

              <div>

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Customer Email
                </label>

                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

              </div>


              {/* Source */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Feedback Source
                </label>

                <select
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
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


            {/* =================================================
                FEEDBACK MESSAGE
            ================================================= */}

            <div className="mt-6">

              <label className="mb-2 block text-sm font-medium text-gray-300">
                Customer Feedback
              </label>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="8"
                required
                placeholder="Enter the customer's feedback..."
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-4 leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

              <p className="mt-2 text-xs text-gray-600">
                Project LOOP AI will analyze this feedback
                after submission.
              </p>

            </div>


            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() =>
                  navigate("/feedback")
                }
                disabled={loading}
                className="rounded-xl border border-gray-700 px-6 py-3 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>


              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-7 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Analyzing Feedback..."
                  : "Submit Feedback"}
              </button>

            </div>

          </form>

        </div>


        {/* =================================================
            AI INFORMATION
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6">

          <div className="flex items-start gap-4">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
              AI
            </div>

            <div>

              <h3 className="font-semibold text-white">
                Automatic AI Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                After you submit the feedback, Project LOOP
                analyzes it using AI to identify sentiment,
                recurring themes, key issues, and useful
                recommendations.
              </p>

            </div>

          </div>

        </div>


        <div className="h-16" />

      </div>
    </div>
  );
}

export default AddFeedbackPage;

