"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Home, TrendingUp, Clock, Shield, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeValueQuiz from "@/components/homevalue/HomeValueQuiz";

const stats = [
  { value: "2 min", label: "Average completion time" },
  { value: "Free", label: "No cost, no obligation" },
  { value: "98%", label: "Accuracy vs. recent sales" },
  { value: "24/7", label: "Available anytime" },
];

const features = [
  {
    icon: <TrendingUp className="w-5 h-5 text-mk-teal-light" />,
    title: "Real-Time Market Data",
    desc: "Your estimate is built on live MLS data, recent comparable sales, and Conejo Valley market trends — updated daily.",
  },
  {
    icon: <Home className="w-5 h-5 text-mk-teal-light" />,
    title: "Property-Specific Analysis",
    desc: "We factor in your home's size, condition, upgrades, and unique features for a precise, personalized valuation.",
  },
  {
    icon: <Clock className="w-5 h-5 text-mk-teal-light" />,
    title: "Instant Results",
    desc: "No waiting. No email. Your full valuation report — with market context — is available the moment you finish.",
  },
  {
    icon: <Shield className="w-5 h-5 text-mk-teal-light" />,
    title: "Private & Secure",
    desc: "Your information is never sold. We use it only to generate your report and follow up if you'd like an expert review.",
  },
];

const trust = [
  "No credit card required",
  "No obligation to list",
  "Expert review available",
  "Licensed CA brokerage",
];

export default function HomeValuePage() {
  const [started, setStarted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  if (started) {
    return <HomeValueQuiz />;
  }

  return (
    <>
      <Header />
      <main
        className={`transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {/* ── Hero ── */}
        <section className="pt-[120px] pb-16 md:pb-24 bg-mk-cream">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 items-center">
              {/* Left */}
              <div className="flex flex-col gap-6">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-mk-teal-light">
                  <span className="w-6 h-px bg-mk-teal-light" />
                  Free Home Valuation
                </span>

                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08] text-gray-900">
                  What is your home worth today?
                </h1>

                <p className="text-base text-gray-500 leading-relaxed max-w-[480px]">
                  Get an accurate, data-driven estimate of your home&apos;s current market
                  value — powered by live MLS data, recent comparable sales, and
                  local Conejo Valley expertise.
                </p>

                <div className="flex flex-wrap gap-3">
                  {trust.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-full px-3 py-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5 text-mk-teal-light" />
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={() => setStarted(true)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors shadow-lg shadow-mk-teal/20"
                  >
                    Get my home value
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <Link
                    href="/#contact"
                    className="text-sm text-gray-500 hover:text-mk-teal transition-colors underline underline-offset-4"
                  >
                    Talk to an agent instead
                  </Link>
                </div>
              </div>

              {/* Right — Visual card */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-mk-teal via-[#1A4D4D] to-[#2A6B6B] p-8 shadow-2xl">
                  {/* Decorative circles */}
                  <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/5" />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />

                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/50">
                        Sample Valuation
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-mk-teal-light/20 text-mk-teal-light font-medium">
                        Live estimate
                      </span>
                    </div>

                    <div>
                      <p className="text-white/60 text-sm mb-1">Estimated market value</p>
                      <p className="font-display text-4xl text-white">$1,247,000</p>
                      <p className="text-mk-teal-light text-sm mt-1">↑ 4.2% vs. last year</p>
                    </div>

                    <div className="border-t border-white/10 pt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-white/50 text-xs mb-0.5">Value range</p>
                        <p className="text-white text-sm font-medium">$1.19M – $1.31M</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs mb-0.5">Days on market</p>
                        <p className="text-white text-sm font-medium">Avg. 22 days</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs mb-0.5">Comparable sales</p>
                        <p className="text-white text-sm font-medium">14 nearby</p>
                      </div>
                      <div>
                        <p className="text-white/50 text-xs mb-0.5">Confidence</p>
                        <p className="text-white text-sm font-medium">High (94%)</p>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-xl p-3">
                      <p className="text-xs text-white/70 leading-relaxed">
                        Based on 4BD/3BA, 2,180 sqft in Thousand Oaks. Updated{" "}
                        <span className="text-white">today</span>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-xl px-4 py-3 flex items-center gap-3 border border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-mk-mint flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-mk-teal" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-900">Market is strong</p>
                    <p className="text-xs text-gray-400">Seller&apos;s market · March 2026</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <section className="py-10 border-y border-gray-200 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-3xl text-mk-teal">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="py-20 bg-mk-cream">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="text-center mb-14">
              <h2 className="font-display text-3xl sm:text-4xl text-gray-900">
                How MasterKey estimates your home
              </h2>
              <p className="text-gray-500 mt-3 max-w-xl mx-auto text-base">
                Our valuation combines three data sources with your specific home details
                for the most accurate free estimate available.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-mk-teal-light/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-mk-mint flex items-center justify-center mb-4">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm mb-2">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA strip ── */}
        <section className="py-16 bg-mk-teal">
          <div className="max-w-[800px] mx-auto px-6 text-center">
            <h2 className="font-display text-3xl sm:text-[2.5rem] text-white leading-tight mb-4">
              Ready to find out what your home is worth?
            </h2>
            <p className="text-white/70 text-base mb-8 max-w-lg mx-auto">
              Takes 2 minutes. No obligation. Get your personalized report instantly.
            </p>
            <button
              onClick={() => setStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-mk-teal text-sm font-semibold hover:bg-mk-mint transition-colors shadow-lg"
            >
              Start my valuation
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
