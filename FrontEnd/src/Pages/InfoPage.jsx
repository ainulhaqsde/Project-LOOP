import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiCpu, FiMessageCircle, FiLayers, FiShield, FiTrendingUp } from "react-icons/fi";

function InfoPage() {
  const features = [
    [FiMessageCircle, "Multi-channel feedback", "Collect and organize feedback from reviews, surveys, support conversations and other customer channels."],
    [FiCpu, "AI analysis", "Automatically understand sentiment, recurring themes and emerging patterns from customer comments."],
    [FiBarChart2, "Clear analytics", "See customer feedback through focused dashboards that make trends easy to understand."],
    [FiLayers, "One workspace", "Keep customer insights organized instead of scattered across different tools and files."],
    [FiTrendingUp, "Actionable insights", "Move from raw feedback to useful signals your team can use for product and service decisions."],
    [FiShield, "Role-aware access", "Separate user and admin experiences to keep your feedback workflow structured and manageable."],
  ];

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-16 text-white sm:px-8 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[.16em] text-blue-300">Built for customer-focused teams</span>
          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">From feedback overload to <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">clear direction.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">Project LOOP brings customer feedback, AI-powered analysis and practical analytics together in one modern workflow.</p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(([Icon, title, text]) => (
            <article key={title} className="group rounded-2xl border border-white/8 bg-slate-900/60 p-6 shadow-lg shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-slate-900">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-500/15 to-violet-500/15 text-blue-300 transition group-hover:scale-105"><Icon size={20} /></div>
              <h2 className="mt-5 text-lg font-bold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-blue-500/10 via-slate-900 to-violet-500/10 p-7 sm:p-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[.16em] text-blue-300">Start your feedback loop</p>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">Turn customer comments into decisions your team can act on.</h2>
              <p className="mt-3 text-slate-400">Create your workspace, add feedback and let Project LOOP help surface the signals that matter.</p>
            </div>
            <Link to="/register" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 font-semibold shadow-xl shadow-blue-950/20 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500">Get started <FiArrowRight /></Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default InfoPage;
