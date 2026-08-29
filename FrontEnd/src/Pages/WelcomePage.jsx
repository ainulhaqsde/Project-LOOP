import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiBarChart2, FiMessageSquare, FiCpu, FiCheckCircle } from "react-icons/fi";

function WelcomePage() {
  const features = [
    { icon: FiMessageSquare, title: "Collect feedback", text: "Bring customer feedback into one simple, organized workspace." },
    { icon: FiCpu, title: "Understand with AI", text: "Detect sentiment, recurring themes and meaningful patterns automatically." },
    { icon: FiBarChart2, title: "Act on insights", text: "Use clear analytics to turn customer voices into better decisions." },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-10 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -right-32 top-48 h-96 w-96 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <section className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:px-10 lg:py-28">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,.8)]" />
            AI-powered customer intelligence
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Turn every customer voice into a
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent"> smarter decision.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            Project LOOP helps teams collect, organize and analyze customer feedback in one place—so you can understand sentiment, discover trends and act faster.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue-950/30 transition hover:-translate-y-0.5 hover:from-blue-500 hover:to-violet-500">
              Start analyzing <FiArrowRight />
            </Link>
            <Link to="/info" className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-white/20 hover:bg-white/10">
              Explore features
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
            <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Fast setup</span>
            <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> AI sentiment analysis</span>
            <span className="flex items-center gap-2"><FiCheckCircle className="text-emerald-400" /> Actionable dashboards</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-blue-500/10 to-violet-500/10 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-slate-500">Live overview</p>
                <h2 className="mt-1 text-lg font-bold">Customer pulse</h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">Healthy</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[['1,248','Feedback'],['78%','Positive'],['12','Themes']].map(([value,label], i) => (
                <div key={label} className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                  <p className={`text-xl font-bold sm:text-2xl ${i === 1 ? 'text-emerald-400' : i === 2 ? 'text-violet-300' : 'text-white'}`}>{value}</p>
                  <p className="mt-1 text-[11px] text-slate-500 sm:text-xs">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-white/8 bg-slate-950/70 p-5">
              <div className="mb-5 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-200">Sentiment trend</p>
                <p className="text-xs text-slate-500">Last 7 days</p>
              </div>
              <div className="flex h-32 items-end gap-2 sm:gap-3">
                {[44,61,53,72,64,82,76,91,84,95,88,100].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-blue-600/40 to-cyan-400/90" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-500">Top theme</p>
                <p className="mt-2 font-semibold text-slate-100">Product Experience</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-slate-950/70 p-4">
                <p className="text-xs text-slate-500">AI insight</p>
                <p className="mt-2 font-semibold text-blue-300">Satisfaction rising ↑</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="group rounded-2xl border border-white/8 bg-white/[0.035] p-6 transition duration-300 hover:-translate-y-1 hover:border-blue-400/20 hover:bg-white/[0.055]">
              <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-blue-300 transition group-hover:scale-105"><Icon size={20} /></span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default WelcomePage;
