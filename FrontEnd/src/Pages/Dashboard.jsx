
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [analytics, setAnalytics] = useState({
    totalFeedback: 0,

    sentiment: {
      positive: 0,
      negative: 0,
      neutral: 0,
    },

    themes: [],

    recentFeedback: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await api("/feedback/analytics");

      console.log("Dashboard analytics response:", data);

      // -------------------------------------------------
      // AUTHENTICATION
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
            "Unable to load dashboard analytics."
        );
      }

      // -------------------------------------------------
      // SUPPORT BOTH RESPONSE STRUCTURES
      // -------------------------------------------------

      const analyticsData =
        data.analytics || data;

      // -------------------------------------------------
      // SAVE ANALYTICS
      // -------------------------------------------------

      setAnalytics({
        totalFeedback:
          analyticsData?.totalFeedback || 0,

        sentiment: {
          positive:
            analyticsData?.sentiment?.positive || 0,

          negative:
            analyticsData?.sentiment?.negative || 0,

          neutral:
            analyticsData?.sentiment?.neutral || 0,
        },

        themes: Array.isArray(
          analyticsData?.themes
        )
          ? analyticsData.themes
          : [],

        recentFeedback:
          Array.isArray(
            analyticsData?.recentFeedback
          )
            ? analyticsData.recentFeedback
            : [],
      });

    } catch (error) {
      console.error(
        "Dashboard analytics error:",
        error
      );

      setError(
        error.message ||
          "Unable to load dashboard analytics."
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // =====================================================
  // CORE VALUES
  // =====================================================

  const total =
    analytics?.totalFeedback || 0;

  const positive =
    analytics?.sentiment?.positive || 0;

  const negative =
    analytics?.sentiment?.negative || 0;

  const neutral =
    analytics?.sentiment?.neutral || 0;

  // =====================================================
  // SENTIMENT PERCENTAGES
  // =====================================================

  const percentages = useMemo(() => {
    if (!total) {
      return {
        positive: 0,
        negative: 0,
        neutral: 0,
      };
    }

    return {
      positive: Math.round(
        (positive / total) * 100
      ),

      negative: Math.round(
        (negative / total) * 100
      ),

      neutral: Math.round(
        (neutral / total) * 100
      ),
    };
  }, [total, positive, negative, neutral]);

  // =====================================================
  // DOMINANT SENTIMENT
  // =====================================================

  const dominantSentiment = useMemo(() => {
    if (total === 0) {
      return {
        label: "No Data",
        color: "text-gray-400",
        description:
          "Add customer feedback to generate insights.",
      };
    }

    if (
      positive >= negative &&
      positive >= neutral
    ) {
      return {
        label: "Positive",
        color: "text-green-400",
        description:
          "Customers are generally responding positively.",
      };
    }

    if (
      negative >= positive &&
      negative >= neutral
    ) {
      return {
        label: "Negative",
        color: "text-red-400",
        description:
          "Customer feedback shows areas that need attention.",
      };
    }

    return {
      label: "Neutral",
      color: "text-yellow-400",
      description:
        "Customer sentiment is relatively balanced.",
    };
  }, [total, positive, negative, neutral]);

  // =====================================================
  // THEME DATA
  // =====================================================

  const themeChartData = useMemo(() => {
    if (!Array.isArray(analytics?.themes)) {
      return [];
    }

    return analytics.themes
      .map((item) => ({
        name:
          typeof item === "string"
            ? item
            : item?.theme || "Unknown",

        count:
          typeof item === "string"
            ? 1
            : item?.count || 0,
      }))
      .filter((item) => item.name)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [analytics]);

  const topTheme =
    themeChartData.length > 0
      ? themeChartData[0]
      : null;

  // =====================================================
  // SENTIMENT CHART
  // =====================================================

  const sentimentChartData = [
    {
      name: "Positive",
      value: positive,
    },

    {
      name: "Negative",
      value: negative,
    },

    {
      name: "Neutral",
      value: neutral,
    },
  ];

  const sentimentColors = [
    "#22c55e",
    "#ef4444",
    "#eab308",
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 lg:px-12">

        <div className="mx-auto max-w-7xl">

          <div className="mb-10">
            <div className="h-4 w-28 animate-pulse rounded bg-gray-800" />

            <div className="mt-4 h-10 w-72 animate-pulse rounded bg-gray-800" />

            <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-gray-900" />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-36 animate-pulse rounded-2xl border border-gray-800 bg-gray-900"
              />
            ))}

          </div>

          <div className="mt-8 h-96 animate-pulse rounded-2xl border border-gray-800 bg-gray-900" />

        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-950 px-5 py-10 text-white sm:px-8 md:px-10 lg:px-12">

      <div className="mx-auto max-w-7xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-10">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-400">
                Project LOOP
              </p>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Feedback Intelligence
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-gray-400">
                Monitor customer sentiment, discover recurring
                themes, and turn feedback into actionable
                business insights.
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
                + Add Feedback
              </button>

              <button
                type="button"
                onClick={() =>
                  fetchAnalytics(true)
                }
                disabled={refreshing}
                className="rounded-xl border border-gray-700 bg-gray-900 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </div>

        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="mb-8 flex flex-col gap-4 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-400 sm:flex-row sm:items-center sm:justify-between">

            <span>{error}</span>

            {error.includes("session") ? (
              <button
                type="button"
                onClick={() =>
                  navigate("/login")
                }
                className="w-fit rounded-lg bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Login Again
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  fetchAnalytics(true)
                }
                className="w-fit rounded-lg bg-red-500/10 px-4 py-2 font-semibold text-red-300 transition hover:bg-red-500/20"
              >
                Try Again
              </button>
            )}

          </div>
        )}


        {/* =================================================
            OVERVIEW
        ================================================= */}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

          {/* TOTAL */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Total Feedback
            </p>

            <div className="mt-4 flex items-end justify-between">

              <p className="text-4xl font-bold text-white">
                {total}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-sm font-bold text-blue-400">
                F
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-600">
              Customer responses analyzed
            </p>

          </div>


          {/* POSITIVE */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Positive
            </p>

            <div className="mt-4 flex items-end justify-between">

              <p className="text-4xl font-bold text-green-400">
                {positive}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10 text-lg font-bold text-green-400">
                +
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-600">
              {percentages.positive}% of total feedback
            </p>

          </div>


          {/* NEGATIVE */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Negative
            </p>

            <div className="mt-4 flex items-end justify-between">

              <p className="text-4xl font-bold text-red-400">
                {negative}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10 text-lg font-bold text-red-400">
                -
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-600">
              {percentages.negative}% of total feedback
            </p>

          </div>


          {/* NEUTRAL */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">

            <p className="text-sm font-medium text-gray-500">
              Neutral
            </p>

            <div className="mt-4 flex items-end justify-between">

              <p className="text-4xl font-bold text-yellow-400">
                {neutral}
              </p>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500/10 text-lg font-bold text-yellow-400">
                =
              </div>

            </div>

            <p className="mt-3 text-xs text-gray-600">
              {percentages.neutral}% of total feedback
            </p>

          </div>

        </div>


        {/* =================================================
            INTELLIGENCE SUMMARY
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

          <div className="mb-6 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
              AI
            </div>

            <div>

              <h2 className="text-xl font-semibold">
                LOOP Intelligence
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                A quick view of what your feedback is telling you.
              </p>

            </div>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            {/* DOMINANT SENTIMENT */}

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Dominant Sentiment
              </p>

              <p
                className={`mt-3 text-2xl font-bold ${dominantSentiment.color}`}
              >
                {dominantSentiment.label}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {dominantSentiment.description}
              </p>

            </div>


            {/* TOP THEME */}

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Top Customer Theme
              </p>

              <p className="mt-3 truncate text-2xl font-bold text-blue-400">
                {topTheme
                  ? topTheme.name
                  : "No Data"}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                {topTheme
                  ? `${topTheme.count} feedback entries mention this theme.`
                  : "Add feedback to discover recurring themes."}
              </p>

            </div>


            {/* FEEDBACK HEALTH */}

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                Feedback Health
              </p>

              <p
                className={`mt-3 text-2xl font-bold ${
                  percentages.negative > 50
                    ? "text-red-400"
                    : percentages.positive >= 50
                    ? "text-green-400"
                    : "text-yellow-400"
                }`}
              >
                {total === 0
                  ? "No Data"
                  : percentages.negative > 50
                  ? "Needs Attention"
                  : percentages.positive >= 50
                  ? "Healthy"
                  : "Mixed"}
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Based on the current sentiment distribution.
              </p>

            </div>

          </div>

        </div>


        {/* =================================================
            CHARTS
        ================================================= */}

        <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2">

          {/* SENTIMENT BAR */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

            <div className="mb-7">

              <h2 className="text-xl font-semibold">
                Sentiment Distribution
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                AI-classified customer sentiment across all feedback.
              </p>

            </div>

            {total === 0 ? (
              <div className="flex h-[320px] items-center justify-center rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-500">
                No feedback data available yet.
              </div>
            ) : (
              <div className="h-[320px] w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={sentimentChartData}
                    margin={{
                      top: 10,
                      right: 10,
                      left: -15,
                      bottom: 10,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#1f2937"
                    />

                    <XAxis
                      dataKey="name"
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                    />

                    <YAxis
                      stroke="#9ca3af"
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />

                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#111827",
                        border: "1px solid #374151",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />

                    <Bar
                      dataKey="value"
                      radius={[8, 8, 0, 0]}
                    >

                      {sentimentChartData.map(
                        (entry, index) => (
                          <Cell
                            key={`bar-${index}`}
                            fill={
                              sentimentColors[index]
                            }
                          />
                        )
                      )}

                    </Bar>

                  </BarChart>

                </ResponsiveContainer>

              </div>
            )}

          </div>


          {/* SENTIMENT PIE */}

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

            <div className="mb-7">

              <h2 className="text-xl font-semibold">
                Sentiment Breakdown
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Percentage of customer responses by sentiment.
              </p>

            </div>

            {total === 0 ? (
              <div className="flex h-[320px] items-center justify-center rounded-xl border border-gray-800 bg-gray-950 text-sm text-gray-500">
                No sentiment data available yet.
              </div>
            ) : (
              <>
                <div className="h-[300px] w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={sentimentChartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={105}
                        innerRadius={65}
                        paddingAngle={3}
                      >

                        {sentimentChartData.map(
                          (entry, index) => (
                            <Cell
                              key={`pie-${index}`}
                              fill={
                                sentimentColors[index]
                              }
                            />
                          )
                        )}

                      </Pie>

                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#111827",
                          border: "1px solid #374151",
                          borderRadius: "12px",
                          color: "#fff",
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

                <div className="grid grid-cols-3 gap-3">

                  <div className="rounded-xl bg-gray-950 p-3 text-center">

                    <div className="mx-auto mb-2 h-2.5 w-2.5 rounded-full bg-green-500" />

                    <p className="text-xs text-gray-500">
                      Positive
                    </p>

                    <p className="mt-1 font-semibold text-green-400">
                      {percentages.positive}%
                    </p>

                  </div>


                  <div className="rounded-xl bg-gray-950 p-3 text-center">

                    <div className="mx-auto mb-2 h-2.5 w-2.5 rounded-full bg-red-500" />

                    <p className="text-xs text-gray-500">
                      Negative
                    </p>

                    <p className="mt-1 font-semibold text-red-400">
                      {percentages.negative}%
                    </p>

                  </div>


                  <div className="rounded-xl bg-gray-950 p-3 text-center">

                    <div className="mx-auto mb-2 h-2.5 w-2.5 rounded-full bg-yellow-500" />

                    <p className="text-xs text-gray-500">
                      Neutral
                    </p>

                    <p className="mt-1 font-semibold text-yellow-400">
                      {percentages.neutral}%
                    </p>

                  </div>

                </div>
              </>
            )}

          </div>

        </div>


        {/* =================================================
            TOP THEMES
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Customer Themes
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Recurring topics identified from customer feedback.
              </p>

            </div>

            <span className="w-fit rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
              AI Analysis
            </span>

          </div>


          {themeChartData.length === 0 ? (

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-10 text-center">

              <p className="text-sm text-gray-500">
                No customer themes available yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-feedback")
                }
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add Feedback
              </button>

            </div>

          ) : (

            <div className="h-[350px] w-full">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={themeChartData}
                  layout="vertical"
                  margin={{
                    top: 10,
                    right: 20,
                    left: 30,
                    bottom: 10,
                  }}
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#1f2937"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={130}
                    stroke="#9ca3af"
                    tickLine={false}
                    axisLine={false}
                    tick={{
                      fontSize: 12,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Bar
                    dataKey="count"
                    fill="#3b82f6"
                    radius={[0, 8, 8, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          )}

        </div>


        {/* =================================================
            AI ACTION AREA
        ================================================= */}

        <div className="mt-8 overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-gray-900 to-gray-900 p-6 shadow-lg sm:p-8">

          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

            <div className="max-w-2xl">

              <div className="mb-4 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 font-bold text-blue-400">
                  AI
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
                    Project LOOP AI
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Ask questions about your customers
                  </h2>

                </div>

              </div>

              <p className="leading-7 text-gray-400">
                Go beyond charts. Ask LOOP AI about customer
                complaints, satisfaction, recurring issues,
                improvement opportunities, and important feedback
                patterns.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                navigate("/ask-ai")
              }
              className="w-full rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 sm:w-fit"
            >
              Ask LOOP AI →
            </button>

          </div>

        </div>


        {/* =================================================
            RECENT FEEDBACK
        ================================================= */}

        <div className="mt-8 rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg sm:p-7">

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-xl font-semibold">
                Recent Feedback
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Latest customer responses analyzed by Project LOOP.
              </p>

            </div>

            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="w-fit rounded-xl border border-gray-700 px-4 py-2.5 text-sm font-semibold text-gray-300 transition hover:border-blue-500/40 hover:text-blue-400"
            >
              View All Feedback →
            </button>

          </div>


          {!Array.isArray(
            analytics?.recentFeedback
          ) ||
          analytics.recentFeedback.length === 0 ? (

            <div className="rounded-xl border border-gray-800 bg-gray-950 p-10 text-center">

              <p className="text-sm text-gray-500">
                No customer feedback has been added yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/add-feedback")
                }
                className="mt-4 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Add First Feedback
              </button>

            </div>

          ) : (

            <div className="space-y-4">

              {analytics.recentFeedback
                .slice(0, 5)
                .map(
                  (feedback, index) => {

                    const sentiment =
                      feedback?.sentiment ||
                      "neutral";

                    return (
                      <div
                        key={
                          feedback?._id ||
                          `feedback-${index}`
                        }
                        className="rounded-xl border border-gray-800 bg-gray-950 p-5 transition hover:border-gray-700"
                      >

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-3">

                              <h3 className="font-semibold text-white">
                                {feedback?.customerName ||
                                  "Anonymous"}
                              </h3>

                              {feedback?.source && (
                                <span className="rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-medium capitalize text-gray-500">
                                  {feedback.source}
                                </span>
                              )}

                            </div>

                            <p className="mt-2 text-sm leading-6 text-gray-400">
                              {feedback?.message ||
                                "No message content available."}
                            </p>

                          </div>


                          <span
                            className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold capitalize ${
                              sentiment ===
                              "positive"
                                ? "border-green-500/20 bg-green-500/10 text-green-400"
                                : sentiment ===
                                  "negative"
                                ? "border-red-500/20 bg-red-500/10 text-red-400"
                                : "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {sentiment}
                          </span>

                        </div>


                        {feedback?.summary && (
                          <div className="mt-4 border-t border-gray-800 pt-4">

                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-600">
                              AI Summary
                            </p>

                            <p className="mt-2 text-sm leading-6 text-gray-500">
                              {feedback.summary}
                            </p>

                          </div>
                        )}

                      </div>
                    );
                  }
                )}

            </div>

          )}

        </div>


        {/* =================================================
            QUICK ACTIONS
        ================================================= */}

        <div className="mt-8">

          <h2 className="mb-5 text-xl font-semibold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            <button
              type="button"
              onClick={() =>
                navigate("/add-feedback")
              }
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-blue-500/40 hover:bg-gray-900/80"
            >

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                +
              </div>

              <h3 className="font-semibold text-white">
                Add Feedback
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Add a new customer response and let LOOP AI
                analyze it automatically.
              </p>

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/feedback")
              }
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-green-500/30 hover:bg-gray-900/80"
            >

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                F
              </div>

              <h3 className="font-semibold text-white">
                Feedback Library
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Browse analyzed feedback, summaries, themes,
                issues, and recommendations.
              </p>

            </button>


            <button
              type="button"
              onClick={() =>
                navigate("/ask-ai")
              }
              className="rounded-2xl border border-gray-800 bg-gray-900 p-6 text-left transition hover:border-purple-500/30 hover:bg-gray-900/80"
            >

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                AI
              </div>

              <h3 className="font-semibold text-white">
                Ask LOOP AI
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Ask natural-language questions and get insights
                from your stored customer feedback.
              </p>

            </button>

          </div>

        </div>


        <div className="h-16" />

      </div>

    </div>
  );
}

export default Dashboard;

