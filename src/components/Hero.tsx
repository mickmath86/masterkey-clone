import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="pt-[120px] pb-16 md:pb-24 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center">
          {/* Left — Copy */}
          <div className="flex flex-col gap-6">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.08] text-gray-900">
              Smarter real estate for your next move
            </h1>

            <p className="text-base text-gray-500 leading-relaxed max-w-[480px]">
              One platform that orchestrates the best market data, AI tools, and local
              expertise to handle transactions, deep market research, and complex
              property projects across Southern California.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center px-7 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
              >
                Get started
              </a>
              <a
                href="#services"
                className="inline-flex items-center px-7 py-3 rounded-full border border-gray-300 text-gray-900 text-sm font-medium hover:border-mk-teal hover:text-mk-teal transition-colors"
              >
                Request a consultation
              </a>
            </div>

            <a
              href="#services"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-mk-teal transition-colors w-fit"
            >
              Explore our services <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right — Visual */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-mk-teal-light via-mk-teal to-[#e8d5b7] aspect-[4/3] shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="bg-white rounded-xl p-6 shadow-xl w-full max-w-[400px]">
                {/* Mock tabs */}
                <div className="flex gap-3 mb-4 pb-3 border-b border-gray-100">
                  <span className="text-xs px-3 py-1 rounded-full bg-mk-mint text-mk-teal font-medium">
                    Market Data
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full text-gray-400">
                    Properties
                  </span>
                  <span className="text-xs px-3 py-1 rounded-full text-gray-400">
                    Clients
                  </span>
                </div>

                {/* Mock data rows */}
                <div className="space-y-3">
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    Conejo Valley median home price up 4.2% YoY to $985K.
                    Inventory down 12% with 28 avg days on market.
                  </div>
                  <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    New listing alert: 4BD/3BA in Thousand Oaks, $1.15M.
                    Comparable sales suggest strong positioning.
                  </div>
                  <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3 leading-relaxed">
                    Client pre-approval verified. Ready to schedule showing
                    for 3 matched properties.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
