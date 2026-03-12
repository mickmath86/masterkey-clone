import { ArrowRight, Home, TrendingUp, MapPin, FileSearch } from "lucide-react";

export default function FeatureRows() {
  return (
    <section className="py-16 md:py-24 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-mk-mint text-mk-teal text-xs font-medium">
            <FileSearch className="w-4 h-4" />
            MasterKey Services
          </span>
        </div>

        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-center text-gray-900 max-w-[720px] mx-auto mb-16">
          Accurate market intelligence is just the start. What you do with it is everything.
        </h2>

        {/* Feature Row 1 — Local Expertise */}
        <div className="grid lg:grid-cols-2 gap-16 items-center py-10 lg:py-16">
          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl lg:text-3xl text-gray-900">
              Local market knowledge
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              Surface insights from decades of Conejo Valley experience. Find
              deep market intelligence in seconds using integrations that
              centralize neighborhood data, school ratings, and pricing trends
              from the sources you already trust.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm text-mk-teal font-medium border border-gray-300 rounded-full px-5 py-2 w-fit hover:border-mk-teal transition-colors"
            >
              Explore our markets <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Visual */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-emerald-100 to-mk-teal-light flex items-center justify-center">
            <div className="bg-white rounded-xl p-5 shadow-md w-[80%]">
              {[
                { icon: Home, label: "Thousand Oaks", sub: "91360" },
                { icon: MapPin, label: "Westlake Village", sub: "91362" },
                { icon: TrendingUp, label: "Newbury Park", sub: "91320" },
                { icon: Home, label: "Agoura Hills", sub: "91301" },
              ].map(({ icon: Icon, label, sub }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-b-0 text-sm text-gray-700"
                >
                  <div className="w-7 h-7 rounded-md bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="flex-1">{label}</span>
                  <span className="text-xs text-gray-400">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Row 2 — Market Research (reversed) */}
        <div className="grid lg:grid-cols-2 gap-16 items-center py-10 lg:py-16">
          {/* Visual first on desktop (rtl trick) */}
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-gradient-to-br from-blue-100 to-blue-300 flex items-center justify-center lg:order-first order-last">
            <div className="bg-white rounded-xl p-5 shadow-md w-[80%]">
              <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wider">
                Market Report — Conejo Valley
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Median Sale Price</span>
                  <span className="font-semibold text-gray-900">$985,000</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Avg Days on Market</span>
                  <span className="font-semibold text-gray-900">28 days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Active Listings</span>
                  <span className="font-semibold text-gray-900">142</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price per Sq Ft</span>
                  <span className="font-semibold text-gray-900">$512</span>
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Sources: MLS, Zillow, Redfin, County Records
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-display text-2xl lg:text-3xl text-gray-900">
              Real-time market research
            </h3>
            <p className="text-base text-gray-500 leading-relaxed">
              Find reliable data across every source that matters. Get verifiable,
              citation-backed answers to any market question. Then dive deeper
              with automatically generated follow-up analysis and neighborhood
              comparisons.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 text-sm text-mk-teal font-medium border border-gray-300 rounded-full px-5 py-2 w-fit hover:border-mk-teal transition-colors"
            >
              Start your search <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
