import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Hero Section */}
      <section className="min-h-[75vh] flex items-center justify-center px-6">

        <div className="max-w-5xl text-center">

          <p className="text-blue-400 font-semibold tracking-wide mb-5">
            AI-POWERED CUSTOMER FEEDBACK INTELLIGENCE
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Close the loop on what
            <span className="text-blue-500"> customers actually want.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Project LOOP helps businesses collect, organize and analyze
            customer feedback from multiple channels using Artificial
            Intelligence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

            <Link
              to="/register"
              className="px-8 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Get Started
            </Link>

            <Link
              to="/info"
              className="px-8 py-3 border border-gray-700 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Learn More
            </Link>

          </div>

        </div>

      </section>


      {/* What LOOP Does */}
      <section className="px-6 py-20 border-t border-gray-800">

        <div className="max-w-6xl mx-auto">

          <div className="text-center">

            <p className="text-blue-400 font-semibold">
              UNDERSTAND YOUR CUSTOMERS
            </p>

            <h2 className="text-3xl md:text-4xl font-bold mt-3">
              Turn feedback into business intelligence
            </h2>

            <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
              LOOP transforms raw customer feedback into meaningful insights
              that help product, support and leadership teams make better
              decisions.
            </p>

          </div>


          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">

            {/* Card 1 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900">

              <div className="text-3xl mb-4">
                💬
              </div>

              <h3 className="text-xl font-semibold text-blue-400">
                Collect Feedback
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Bring customer feedback from reviews, surveys, support
                conversations and other channels into one centralized
                platform.
              </p>

            </div>


            {/* Card 2 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900">

              <div className="text-3xl mb-4">
                🤖
              </div>

              <h3 className="text-xl font-semibold text-blue-400">
                AI-Powered Analysis
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Automatically identify sentiment, recurring themes and
                emerging trends from customer feedback.
              </p>

            </div>


            {/* Card 3 */}
            <div className="p-6 rounded-xl border border-gray-800 bg-gray-900">

              <div className="text-3xl mb-4">
                📊
              </div>

              <h3 className="text-xl font-semibold text-blue-400">
                Actionable Insights
              </h3>

              <p className="mt-3 text-gray-400 leading-relaxed">
                Turn customer feedback into evidence-backed insights that
                help your team make faster, data-driven decisions.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* How It Works */}
      <section className="px-6 py-20">

        <div className="max-w-5xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold">
            How Project LOOP Works
          </h2>

          <p className="mt-4 text-gray-400">
            From raw feedback to useful business intelligence.
          </p>


          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">

            <div>
              <div className="text-blue-500 text-3xl font-bold">
                01
              </div>

              <h3 className="mt-3 font-semibold">
                Collect
              </h3>

              <p className="mt-2 text-gray-400 text-sm">
                Gather customer feedback from multiple channels.
              </p>
            </div>


            <div>
              <div className="text-blue-500 text-3xl font-bold">
                02
              </div>

              <h3 className="mt-3 font-semibold">
                Organize
              </h3>

              <p className="mt-2 text-gray-400 text-sm">
                Centralize and structure all customer feedback.
              </p>
            </div>


            <div>
              <div className="text-blue-500 text-3xl font-bold">
                03
              </div>

              <h3 className="mt-3 font-semibold">
                Analyze
              </h3>

              <p className="mt-2 text-gray-400 text-sm">
                Use AI to identify sentiment, themes and trends.
              </p>
            </div>


            <div>
              <div className="text-blue-500 text-3xl font-bold">
                04
              </div>

              <h3 className="mt-3 font-semibold">
                Act
              </h3>

              <p className="mt-2 text-gray-400 text-sm">
                Turn insights into better business decisions.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="px-6 py-20 border-t border-gray-800">

        <div className="max-w-4xl mx-auto text-center">

          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to understand your customers better?
          </h2>

          <p className="mt-4 text-gray-400">
            Start turning customer feedback into meaningful intelligence
            with Project LOOP.
          </p>

          <Link
            to="/register"
            className="inline-block mt-8 px-8 py-3 bg-blue-600 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Get Started
          </Link>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-gray-800 py-6 text-center text-gray-500">

        © 2026 Project LOOP. All rights reserved.

      </footer>

    </div>
  );
}

export default HomePage;