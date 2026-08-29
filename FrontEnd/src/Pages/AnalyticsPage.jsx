import React, { useEffect, useMemo, useState } from "react";
import api from "../services/api";

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // FETCH ANALYTICS
  // =====================================================

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await api("/feedback/analytics");

      console.log("Analytics response:", data);

      if (data.status === 401) {
        setError("Your session has expired. Please login again.");
        return;
      }

      if (!data.ok || data.success === false) {
        throw new Error(
          data.message || "Unable to load analytics."
        );
      }

      setAnalytics(data);
    } catch (error) {
      console.error("Analytics error:", error);

      setError(
        error.message || "Unable to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // CALCULATE SENTIMENT PERCENTAGES
  // =====================================================

  const sentimentPercentages = useMemo(() => {
    if (!analytics) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
      };
    }

    const total = analytics.totalFeedback || 0;

    if (total === 0) {
      return {
        positive: 0,
        neutral: 0,
        negative: 0,
      };
    }

    return {
      positive: Math.round(
        ((analytics.sentiment?.positive || 0) / total) * 100
      ),

      neutral: Math.round(
        ((analytics.sentiment?.neutral || 0) / total) * 100
      ),

      negative: Math.round(
        ((analytics.sentiment?.negative || 0) / total) * 100
      ),
    };
  }, [analytics]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Analytics Dashboard
            </h1>

            <p className="mt-3 text-gray-400">
              Loading customer feedback insights...
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-gray-800 bg-gray-900"
              />
            ))}

          </div>

        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold sm:text-4xl">
              Analytics Dashboard
            </h1>
          </div>

          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6">

            <p className="font-semibold text-red-400">
              Unable to load analytics
            </p>

            <p className="mt-2 text-sm text-red-300">
              {error}
            </p>

            <button
              onClick={fetchAnalytics}
              className="mt-5 rounded-xl bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
            >
              Try Again
            </button>

          </div>

        </div>
      </div>
    );
  }

  const totalFeedback = analytics?.totalFeedback || 0;

  const positive =
    analytics?.sentiment?.positive || 0;

  const neutral =
    analytics?.sentiment?.neutral || 0;

  const negative =
    analytics?.sentiment?.negative || 0;

  const themes =
    analytics?.themes || [];

  const recentFeedback =
    analytics?.recentFeedback || [];

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

          <div>

            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
              Project LOOP
            </p>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Analytics Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
              Understand customer sentiment, identify recurring
              themes, and discover the most important feedback
              patterns.
            </p>

          </div>

          <button
            onClick={fetchAnalytics}
            className="w-fit rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
          >
            Refresh Analytics
          </button>

        </div>


        {/* =================================================
            OVERVIEW CARDS
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Total Feedback
            </p>

            <p className="mt-3 text-4xl font-bold text-white">
              {totalFeedback}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Customer responses collected
            </p>

          </div>


          {/* Positive */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Positive
            </p>

            <p className="mt-3 text-4xl font-bold text-green-400">
              {positive}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {sentimentPercentages.positive}% of feedback
            </p>

          </div>


          {/* Neutral */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Neutral
            </p>

            <p className="mt-3 text-4xl font-bold text-yellow-400">
              {neutral}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {sentimentPercentages.neutral}% of feedback
            </p>

          </div>


          {/* Negative */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Negative
            </p>

            <p className="mt-3 text-4xl font-bold text-red-400">
              {negative}
            </p>

            <p className="mt-2 text-sm text-gray-500">
              {sentimentPercentages.negative}% of feedback
            </p>

          </div>

        </div>


        {/* =================================================
            SENTIMENT OVERVIEW
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">

          <div className="mb-7">

            <h2 className="text-xl font-semibold">
              Customer Sentiment
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Overall sentiment distribution across all customer
              feedback.
            </p>

          </div>


          {/* Positive */}

          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-green-400" />

                <span className="text-sm font-medium text-gray-300">
                  Positive
                </span>

              </div>

              <span className="text-sm font-semibold text-green-400">
                {positive} ({sentimentPercentages.positive}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-800">

              <div
                className="h-full rounded-full bg-green-500 transition-all duration-700"
                style={{
                  width: `${sentimentPercentages.positive}%`,
                }}
              />

            </div>

          </div>


          {/* Neutral */}

          <div className="mb-6">

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-yellow-400" />

                <span className="text-sm font-medium text-gray-300">
                  Neutral
                </span>

              </div>

              <span className="text-sm font-semibold text-yellow-400">
                {neutral} ({sentimentPercentages.neutral}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-800">

              <div
                className="h-full rounded-full bg-yellow-500 transition-all duration-700"
                style={{
                  width: `${sentimentPercentages.neutral}%`,
                }}
              />

            </div>

          </div>


          {/* Negative */}

          <div>

            <div className="mb-2 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="h-3 w-3 rounded-full bg-red-400" />

                <span className="text-sm font-medium text-gray-300">
                  Negative
                </span>

              </div>

              <span className="text-sm font-semibold text-red-400">
                {negative} ({sentimentPercentages.negative}%)
              </span>

            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-800">

              <div
                className="h-full rounded-full bg-red-500 transition-all duration-700"
                style={{
                  width: `${sentimentPercentages.negative}%`,
                }}
              />

            </div>

          </div>

        </div>


        {/* =================================================
            THEMES
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">

          <div className="mb-7">

            <h2 className="text-xl font-semibold">
              Main Customer Themes
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Topics that appear most frequently in customer
              feedback.
            </p>

          </div>


          {themes.length === 0 ? (

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 text-center text-sm text-gray-500">
              No themes available yet.
            </div>

          ) : (

            <div className="space-y-4">

              {themes.slice(0, 10).map(
                (item, index) => {

                  const maxCount =
                    themes[0]?.count || 1;

                  const percentage =
                    Math.round(
                      (item.count / maxCount) * 100
                    );

                  return (
                    <div
                      key={`${item.theme}-${index}`}
                    >

                      <div className="mb-2 flex items-center justify-between gap-4">

                        <span className="text-sm font-medium text-gray-300">
                          {item.theme}
                        </span>

                        <span className="text-xs font-semibold text-blue-400">
                          {item.count}
                        </span>

                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-800">

                        <div
                          className="h-full rounded-full bg-blue-500 transition-all duration-700"
                          style={{
                            width: `${percentage}%`,
                          }}
                        />

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          )}

        </div>


        {/* =================================================
            RECENT FEEDBACK
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-8">

          <div className="mb-7">

            <h2 className="text-xl font-semibold">
              Recent Feedback
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              The latest customer feedback analyzed by Project
              LOOP.
            </p>

          </div>


          {recentFeedback.length === 0 ? (

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-6 text-center text-sm text-gray-500">
              No feedback available yet.
            </div>

          ) : (

            <div className="space-y-4">

              {recentFeedback.map((feedback) => (

                <div
                  key={feedback._id}
                  className="rounded-xl border border-gray-800 bg-gray-950 p-5"
                >

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>

                      <h3 className="font-semibold text-white">
                        {feedback.customerName}
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        {feedback.source || "Unknown source"}
                      </p>

                    </div>


                    <span
                      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                        feedback.sentiment === "positive"
                          ? "border-green-500/20 bg-green-500/10 text-green-400"
                          : feedback.sentiment === "negative"
                          ? "border-red-500/20 bg-red-500/10 text-red-400"
                          : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {feedback.sentiment || "neutral"}
                    </span>

                  </div>


                  <p className="mt-4 leading-7 text-gray-400">
                    {feedback.message}
                  </p>


                  {feedback.summary && (
                    <div className="mt-4 rounded-lg border border-gray-800 bg-gray-900 p-4">

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-600">
                        AI Summary
                      </p>

                      <p className="text-sm leading-6 text-gray-400">
                        {feedback.summary}
                      </p>

                    </div>
                  )}

                </div>

              ))}

            </div>

          )}

        </div>


        <div className="h-16" />

      </div>
    </div>
  );
}

export default AnalyticsPage;

