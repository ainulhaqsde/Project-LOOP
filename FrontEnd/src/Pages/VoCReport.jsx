import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../services/api";

function VoCReport() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GENERATE REPORT
  // =====================================================

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      setError("");
      setReport("");

      const data = await api("/feedback/voc-report", {
        method: "POST",
      });

      console.log(
        "VoC Report response:",
        data
      );

      // =================================================
      // AUTHENTICATION ERROR
      // =================================================

      if (data.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );

        return;
      }

      // =================================================
      // AUTHORIZATION ERROR
      // =================================================

      if (data.status === 403) {
        setError(
          "You do not have permission to generate this report."
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
            "Unable to generate the Voice of Customer report."
        );
      }

      // =================================================
      // GET REPORT
      // =================================================

      const generatedReport =
        data.report ||
        data.response ||
        data.result ||
        "";

      if (!generatedReport) {
        throw new Error(
          "LOOP AI did not return a report. Please try again."
        );
      }

      setReport(
        generatedReport
      );

    } catch (error) {
      console.error(
        "VoC Report error:",
        error
      );

      setError(
        error.message ||
          "Unable to generate the Voice of Customer report."
      );

    } finally {
      setLoading(false);
    }
  };


  // =====================================================
  // PRINT / SAVE AS PDF
  // =====================================================

  const handlePrintReport = () => {
    window.print();
  };


  // =====================================================
  // CLEAR REPORT
  // =====================================================

  const handleClearReport = () => {
    setReport("");
    setError("");
  };


  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">

      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
            Project LOOP
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Voice of Customer Report
          </h1>

          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-400">
            Generate an AI-powered Voice of Customer report
            using the feedback stored in Project LOOP.
            Discover customer sentiment, recurring themes,
            concerns, positive experiences, and actionable
            business recommendations.
          </p>

        </div>


        {/* =================================================
            REPORT GENERATOR
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                AI Voice of Customer Intelligence
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                LOOP AI will analyze your available customer
                feedback and create a structured business report.
              </p>

            </div>


            <button
              type="button"
              onClick={handleGenerateReport}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Generating Report..."
                : "Generate VoC Report"}
            </button>

          </div>

        </div>


        {/* =================================================
            INFORMATION CARDS
        ================================================= */}

        {!report && !loading && !error && (

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm font-semibold text-blue-400">
                Sentiment
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Understand overall customer sentiment.
              </p>

            </div>


            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm font-semibold text-blue-400">
                Themes
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Discover recurring customer topics.
              </p>

            </div>


            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm font-semibold text-blue-400">
                Concerns
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Identify customer problems and complaints.
              </p>

            </div>


            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5">

              <p className="text-sm font-semibold text-blue-400">
                Actions
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Receive practical AI recommendations.
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            LOADING STATE
        ================================================= */}

        {loading && (

          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-gray-900 p-10 text-center shadow-xl">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 font-bold text-blue-400">
              AI
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Analyzing customer feedback
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              LOOP AI is generating your Voice of Customer
              intelligence report. This may take a few seconds.
            </p>

          </div>

        )}


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-sm text-red-400">
                {error}
              </p>


              {error.includes("session") ? (

                <button
                  type="button"
                  onClick={() =>
                    navigate("/login")
                  }
                  className="w-fit rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                >
                  Login Again
                </button>

              ) : (

                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="w-fit rounded-lg bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
                >
                  Try Again
                </button>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            GENERATED REPORT
        ================================================= */}

        {report && (

          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-gray-900 p-6 shadow-xl sm:p-8">

            {/* REPORT HEADER */}

            <div className="mb-6 flex flex-col gap-5 border-b border-gray-800 pb-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
                  AI
                </div>

                <div>

                  <h2 className="text-xl font-semibold">
                    Voice of Customer Intelligence
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Generated from stored customer feedback
                  </p>

                </div>

              </div>


              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={handleClearReport}
                  className="rounded-xl border border-gray-700 px-5 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-gray-600 hover:text-white"
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleGenerateReport}
                  disabled={loading}
                  className="rounded-xl border border-blue-500/40 px-5 py-2.5 text-sm font-semibold text-blue-400 transition hover:bg-blue-500/10"
                >
                  Regenerate
                </button>

                <button
                  type="button"
                  onClick={handlePrintReport}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Print / Save PDF
                </button>

              </div>

            </div>


            {/* REPORT CONTENT */}

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 sm:p-7">

              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-blue-400">
                AI Generated Report
              </p>

              <div className="text-sm leading-7 text-gray-300 sm:text-base">
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="mb-6 mt-2 text-2xl font-bold text-white sm:text-3xl">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="mb-3 mt-8 border-b border-gray-800 pb-2 text-xl font-semibold text-blue-300">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="mb-2 mt-6 text-lg font-semibold text-white">
          {children}
        </h3>
      ),

      p: ({ children }) => (
        <p className="mb-4 leading-7 text-gray-300">
          {children}
        </p>
      ),

      strong: ({ children }) => (
        <strong className="font-semibold text-white">
          {children}
        </strong>
      ),

      ul: ({ children }) => (
        <ul className="mb-5 ml-6 list-disc space-y-2 text-gray-300">
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol className="mb-5 ml-6 list-decimal space-y-3 text-gray-300">
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="pl-1 leading-7">
          {children}
        </li>
      ),
    }}
  >
    {report}
  </ReactMarkdown>
</div>

            </div>


            {/* REPORT FOOTER */}

            <div className="mt-6 rounded-xl border border-gray-800 bg-gray-950/50 p-4">

              <p className="text-xs leading-5 text-gray-600">
                This report is generated by LOOP AI using the
                customer feedback available in Project LOOP.
                Business decisions should consider the quantity
                and quality of the available feedback data.
              </p>

            </div>

          </div>

        )}


        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">

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
              View sentiment, themes, and feedback trends.
            </p>

          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/ask-ai")
            }
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40"
          >

            <p className="font-semibold">
              Ask LOOP AI
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Ask questions about your customer feedback.
            </p>

          </button>


          <button
            type="button"
            onClick={() =>
              navigate("/feedback")
            }
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40"
          >

            <p className="font-semibold">
              Customer Feedback
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Review the feedback used by LOOP AI.
            </p>

          </button>

        </div>


        <div className="h-16" />

      </div>

    </div>
  );
}

export default VoCReport;