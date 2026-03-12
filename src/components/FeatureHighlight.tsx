import { BarChart3, FileText, Users, Zap, Clock } from "lucide-react";

export default function FeatureHighlight() {
  return (
    <section id="services" className="py-16 md:py-24 bg-mk-lavender">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-mk-mint text-mk-teal text-xs font-medium">
            <Zap className="w-4 h-4" />
            MasterKey Platform
          </span>
        </div>

        {/* Headline */}
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-center text-gray-900 max-w-[700px] mx-auto mb-4">
          Market intelligence puts 20+ data sources to work for you.
        </h2>
        <p className="text-base text-gray-500 text-center max-w-[600px] mx-auto mb-12">
          Research, analyze, compare, and close — all from one system built for
          Southern California real estate.
        </p>

        {/* Demo card */}
        <div className="max-w-[900px] mx-auto bg-mk-dark rounded-2xl p-8 shadow-xl mb-8">
          <div className="space-y-2">
            {[
              { title: "Conejo Valley Q1 2026 Market Report", icon: BarChart3 },
              { title: "Comparative Market Analysis — 123 Oak Ave", icon: FileText },
              { title: "Buyer Lead Qualification Pipeline", icon: Users },
              { title: "Neighborhood Deep-Dive: Thousand Oaks", icon: BarChart3 },
              { title: "Listing Optimization & Pricing Strategy", icon: Clock },
            ].map(({ title, icon: Icon }) => (
              <div
                key={title}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-white/80 text-sm hover:bg-white/5 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-mk-teal-light" />
                  {title}
                </span>
                <span className="text-xs text-mk-teal-light bg-mk-teal-light/15 px-3 py-1 rounded-full">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-2.5 rounded-full bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition-colors shadow-sm"
          >
            Learn more
          </a>
        </div>
      </div>
    </section>
  );
}
