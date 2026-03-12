"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

const features = [
  {
    title: "Data-Driven",
    body: "Your dedicated market intelligence engine — pulling from 20+ sources to give you a competitive edge in every transaction.",
  },
  {
    title: "Hyper-Local",
    body: "Deep expertise in Thousand Oaks, Westlake Village, Newbury Park, and the greater Conejo Valley. Every recommendation is backed by neighborhood-level data.",
  },
  {
    title: "Personal",
    body: "A hands-on approach tailored to your goals — whether you're buying your first home, selling a luxury property, or growing a multifamily portfolio.",
  },
];

export default function DarkSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 md:py-24 bg-mk-teal text-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-mk-teal-light/20 text-mk-teal-light text-xs font-medium">
            🌐 MasterKey Advantage
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-center text-white mb-4 max-w-[680px] mx-auto">
          Navigate your market with confidence.
        </h2>
        <p className="text-base text-white/70 text-center max-w-[520px] mx-auto mb-12">
          Accelerate your real estate goals with MasterKey&apos;s technology-forward approach.
        </p>

        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 items-center">
          {/* Accordion */}
          <div className="flex flex-col gap-2">
            {features.map((f, i) => {
              const isActive = i === activeIndex;
              return (
                <div
                  key={f.title}
                  className={`border border-white/15 rounded-lg overflow-hidden transition-colors ${
                    isActive ? "bg-white/5" : ""
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between px-5 py-4 text-base font-medium text-left"
                    onClick={() => setActiveIndex(i)}
                  >
                    {f.title}
                    <Plus
                      className={`w-5 h-5 flex-shrink-0 transition-transform ${
                        isActive ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-400 ${
                      isActive ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <p className="px-5 pb-5 text-sm text-white/65 leading-relaxed">
                      {f.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Visual */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-mk-teal-light/20 to-mk-teal/80 aspect-[4/3] flex items-center justify-center p-6">
            <div className="bg-white/[0.08] border border-white/12 rounded-xl p-5 w-[90%] backdrop-blur-sm">
              <div className="flex gap-2 mb-3 flex-wrap">
                {[
                  "Residential",
                  "Commercial",
                  "Multifamily",
                  "Land",
                  "Investment",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-white/10 text-xs text-white/70 whitespace-nowrap"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="bg-white/5 border border-white/[0.08] rounded-md p-3 mt-2 text-xs text-white/60 leading-relaxed">
                Analyzing Conejo Valley market trends across 4 ZIP codes.
                Identifying undervalued properties with 15%+ appreciation
                potential based on comparable sales and development pipeline.
              </div>
              <div className="bg-white/5 border border-white/[0.08] rounded-md p-3 mt-2 text-xs text-white/60 leading-relaxed">
                3 properties match your investment criteria. Estimated CAP
                rates range from 5.2% to 7.1%.
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
