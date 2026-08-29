
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AskAI() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [askedQuestion, setAskedQuestion] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // SUGGESTED QUESTIONS
  // =====================================================

  const suggestedQuestions = [
    "What are the biggest complaints from customers?",
    "What are customers most happy about?",
    "What should we improve based on customer feedback?",
    "What is the overall customer sentiment?",
    "Summarize the most important customer feedback.",
    "What are the most common problems mentioned by customers?",
  ];

  // =====================================================
  // ASK AI
  // =====================================================

  const handleAskAI = async (event) => {
    event.preventDefault();

    const cleanQuestion = question.trim();

    setError("");
    setAnswer("");

    if (!cleanQuestion) {
      setError("Please enter a question before asking AI.");
      return;
    }

    if (cleanQuestion.length < 5) {
      setError("Please enter a more detailed question.");
      return;
    }

    try {
      setLoading(true);

      const data = await api("/feedback/ask-ai", {
        method: "POST",

        body: JSON.stringify({
          question: cleanQuestion,
        }),
      });

      console.log("Ask AI response:", data);

      // =================================================
      // AUTHENTICATION
      // =================================================

      if (data.status === 401) {
        setError(
          "Your session has expired. Please login again."
        );
        return;
      }

      // =================================================
      // AUTHORIZATION
      // =================================================

      if (data.status === 403) {
        setError(
          "You do not have permission to use LOOP AI."
        );
        return;
      }

      // =================================================
      // API ERROR
      // =================================================

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message ||
            "Unable to get an answer from LOOP AI."
        );
      }

      // =================================================
      // GET ANSWER
      // =================================================

      const aiAnswer =
        data.answer ||
        data.response ||
        data.result ||
        "";

      if (!aiAnswer) {
        throw new Error(
          "LOOP AI did not return an answer. Please try again."
        );
      }

      setAskedQuestion(cleanQuestion);
      setAnswer(aiAnswer);

    } catch (error) {
      console.error("Ask AI error:", error);

      setError(
        error.message ||
          "Unable to get an answer from LOOP AI."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // USE SUGGESTED QUESTION
  // =====================================================

  const handleSuggestedQuestion = (suggestion) => {
    setQuestion(suggestion);
    setAnswer("");
    setAskedQuestion("");
    setError("");
  };

  // =====================================================
  // CLEAR
  // =====================================================

  const handleClear = () => {
    setQuestion("");
    setAnswer("");
    setAskedQuestion("");
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
            Ask LOOP AI
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
            Ask questions about your customer feedback and
            receive AI-powered business insights based on the
            feedback stored in Project LOOP.
          </p>

        </div>


        {/* =================================================
            QUESTION FORM
        ================================================= */}

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-xl sm:p-8">

          <div className="mb-6">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-semibold">
                  Ask a question
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  LOOP AI will analyze your stored customer
                  feedback to generate an answer.
                </p>

              </div>

              {question.length > 0 && (
                <span className="text-xs text-gray-600">
                  {question.length}/1000
                </span>
              )}

            </div>

          </div>


          <form onSubmit={handleAskAI}>

            <textarea
              value={question}
              onChange={(event) => {
                const value = event.target.value;

                if (value.length <= 1000) {
                  setQuestion(value);
                  setError("");
                }
              }}
              rows="6"
              maxLength={1000}
              disabled={loading}
              placeholder="Example: What are the biggest complaints from customers?"
              className="w-full resize-none rounded-xl border border-gray-700 bg-gray-950 px-5 py-4 leading-7 text-white outline-none transition placeholder:text-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            />


            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">

              {(question || answer) && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="rounded-xl border border-gray-700 px-6 py-3.5 text-sm font-semibold text-gray-400 transition hover:border-gray-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>
              )}

              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="rounded-xl bg-blue-600 px-7 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Analyzing Feedback..."
                  : "Ask LOOP AI"}
              </button>

            </div>

          </form>

        </div>


        {/* =================================================
            SUGGESTED QUESTIONS
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

          <div className="mb-5">

            <h2 className="text-lg font-semibold">
              Suggested Questions
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Select a question to quickly start an AI analysis.
            </p>

          </div>


          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

            {suggestedQuestions.map(
              (suggestion, index) => (

                <button
                  key={index}
                  type="button"
                  disabled={loading}
                  onClick={() =>
                    handleSuggestedQuestion(
                      suggestion
                    )
                  }
                  className="rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-left text-sm leading-6 text-gray-400 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>

              )
            )}

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="mt-8 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">

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
            AI ANSWER
        ================================================= */}

        {answer && (

          <div className="mt-8 rounded-2xl border border-blue-500/20 bg-gray-900 p-6 shadow-xl sm:p-8">

            {/* AI HEADER */}

            <div className="mb-6 flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
                AI
              </div>

              <div>

                <h2 className="text-xl font-semibold">
                  LOOP AI Insight
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Generated from your customer feedback
                </p>

              </div>

            </div>


            {/* QUESTION */}

            {askedQuestion && (

              <div className="mb-5 rounded-xl border border-gray-800 bg-gray-950 p-5">

                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Your Question
                </p>

                <p className="text-sm leading-6 text-gray-300">
                  {askedQuestion}
                </p>

              </div>

            )}


            {/* ANSWER */}

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">

              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-blue-400">
                AI Analysis
              </p>

              <p className="whitespace-pre-wrap text-sm leading-7 text-gray-300 sm:text-base">
                {answer}
              </p>

            </div>


            {/* ACTIONS */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={() => navigate("/analytics")}
                className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
              >
                View Analytics
              </button>

              <button
                type="button"
                onClick={() => navigate("/feedback")}
                className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
              >
                View Feedback
              </button>

            </div>

          </div>

        )}


        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {!answer && !loading && !error && (

          <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-lg font-bold text-blue-400">
              AI
            </div>

            <h2 className="mt-5 text-lg font-semibold">
              Ready to analyze your feedback
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Ask LOOP AI about customer complaints,
              satisfaction, sentiment, recurring issues, or
              improvement opportunities.
            </p>

          </div>

        )}


        {/* =================================================
            BOTTOM NAVIGATION
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">

          <button
            type="button"
            onClick={() => navigate("/analytics")}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40"
          >

            <p className="font-semibold">
              Analytics Dashboard
            </p>

            <p className="mt-2 text-sm text-gray-500">
              View sentiment, themes, and customer feedback
              trends.
            </p>

          </button>


          <button
            type="button"
            onClick={() => navigate("/feedback")}
            className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40"
          >

            <p className="font-semibold">
              Customer Feedback
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Review the feedback that LOOP AI uses for analysis.
            </p>

          </button>

        </div>


        <div className="h-16" />

      </div>

    </div>
  );
}

export default AskAI;

