import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import api from "../services/api";

function EditFeedbackPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [feedback, setFeedback] = useState({
    customerName: "",
    customerEmail: "",
    source: "website",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // =====================================================
  // FETCH SINGLE FEEDBACK
  // =====================================================

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        // IMPORTANT:
        // Fetch only the requested feedback.
        // Backend route:
        // GET /feedback/:id

        const data = await api(
          `/feedback/${id}`
        );

        console.log(
          "Single feedback response:",
          data
        );

        // =================================================
        // SESSION EXPIRED
        // =================================================

        if (
          data.status === 401 ||
          data.sessionExpired
        ) {
          setError(
            "Your session has expired. Please login again."
          );

          return;
        }

        // =================================================
        // API ERROR
        // =================================================

        if (
          !data.ok ||
          data.success === false
        ) {
          throw new Error(
            data.message ||
              "Failed to fetch feedback."
          );
        }

        // =================================================
        // CHECK FEEDBACK
        // =================================================

        if (!data.feedback) {
          setError(
            "Feedback not found."
          );

          return;
        }

        // =================================================
        // SET FORM DATA
        // =================================================

        setFeedback({
          customerName:
            data.feedback.customerName ||
            "",

          customerEmail:
            data.feedback.customerEmail ||
            "",

          source:
            data.feedback.source ||
            "website",

          message:
            data.feedback.message ||
            "",
        });

      } catch (error) {
        console.error(
          "Fetch single feedback error:",
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

    if (id) {
      fetchFeedback();
    } else {
      setError(
        "Invalid feedback ID."
      );
      setLoading(false);
    }
  }, [id]);

  // =====================================================
  // HANDLE INPUT CHANGES
  // =====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFeedback((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // UPDATE FEEDBACK
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    // ===================================================
    // FRONTEND VALIDATION
    // ===================================================

    if (!feedback.customerName.trim()) {
      setError(
        "Customer name is required."
      );

      setSaving(false);
      return;
    }

    if (!feedback.customerEmail.trim()) {
      setError(
        "Customer email is required."
      );

      setSaving(false);
      return;
    }

    if (!feedback.message.trim()) {
      setError(
        "Customer feedback is required."
      );

      setSaving(false);
      return;
    }

    try {
      // =================================================
      // PAYLOAD
      // =================================================

      const payload = {
        customerName:
          feedback.customerName.trim(),

        customerEmail:
          feedback.customerEmail.trim(),

        source:
          feedback.source,

        message:
          feedback.message.trim(),
      };

      // =================================================
      // UPDATE
      // =================================================

      const data = await api(
        `/feedback/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      console.log(
        "Update feedback response:",
        data
      );

      // =================================================
      // SESSION EXPIRED
      // =================================================

      if (
        data.status === 401 ||
        data.sessionExpired
      ) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // =================================================
      // UPDATE ERROR
      // =================================================

      if (
        !data.ok ||
        data.success === false
      ) {
        throw new Error(
          data.message ||
            "Failed to update feedback."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Feedback updated successfully. AI analysis has been refreshed if the message changed."
      );

      // =================================================
      // RETURN TO FEEDBACK PAGE
      // =================================================

      setTimeout(() => {
        navigate("/feedback");
      }, 1000);

    } catch (error) {
      console.error(
        "Update feedback error:",
        error
      );

      setError(
        error.message ||
          "Unable to update feedback."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING STATE
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white">

        <div className="mx-auto flex min-h-[70vh] max-w-4xl items-center justify-center">

          <div className="rounded-2xl border border-gray-800 bg-gray-900 px-8 py-10 text-center">

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

      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="mb-10">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Customer Intelligence
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Edit Feedback
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Update the customer's feedback information.
            If the feedback message changes, Project LOOP
            will automatically run AI analysis again.
          </p>

        </div>

        {/* SUCCESS MESSAGE */}

        {message && (
          <div className="mb-6 rounded-xl border border-green-500/20 bg-green-500/10 px-5 py-4 text-sm text-green-400">
            {message}
          </div>
        )}

        {/* ERROR MESSAGE */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-5">

            <p className="text-sm font-semibold text-red-400">
              Unable to update feedback
            </p>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

          </div>
        )}

        {/* FORM */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8 lg:p-10">

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-7"
          >

            {/* CUSTOMER NAME */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="customerName"
                className="text-sm font-medium text-gray-300"
              >
                Customer Name
              </label>

              <input
                id="customerName"
                name="customerName"
                type="text"
                value={
                  feedback.customerName
                }
                onChange={handleChange}
                required
                placeholder="Enter customer name"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

            {/* CUSTOMER EMAIL */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="customerEmail"
                className="text-sm font-medium text-gray-300"
              >
                Customer Email
              </label>

              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={
                  feedback.customerEmail
                }
                onChange={handleChange}
                required
                placeholder="Enter customer email"
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

            {/* SOURCE */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="source"
                className="text-sm font-medium text-gray-300"
              >
                Feedback Source
              </label>

              <select
                id="source"
                name="source"
                value={
                  feedback.source
                }
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-gray-300 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
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

            {/* MESSAGE */}

            <div className="flex flex-col gap-2">

              <label
                htmlFor="message"
                className="text-sm font-medium text-gray-300"
              >
                Customer Feedback
              </label>

              <textarea
                id="message"
                name="message"
                value={
                  feedback.message
                }
                onChange={handleChange}
                rows="8"
                required
                placeholder="Enter customer feedback..."
                className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />

            </div>

            {/* BUTTONS */}

            <div className="flex flex-col gap-4 pt-4 sm:flex-row">

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/feedback")
                }
                disabled={saving}
                className="rounded-xl border border-gray-700 px-7 py-3.5 font-semibold text-gray-300 transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

        <div className="h-16" />

      </div>

    </div>
  );
}

export default EditFeedbackPage;