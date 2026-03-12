export default function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-gray-900">
            Real results for real homeowners.
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6 mb-10">
          {/* Featured testimonial */}
          <div className="bg-gray-100 rounded-2xl p-8 flex flex-col justify-between">
            <div>
              <p className="text-lg font-bold text-gray-900 mb-6">
                The Ramirez Family
              </p>
              <blockquote className="text-base text-gray-700 leading-relaxed mb-6 italic">
                &ldquo;When you&apos;re navigating a competitive market like
                Thousand Oaks, every insight matters. MasterKey gave us
                data-backed recommendations in hours instead of weeks, which
                meant we could move fast and negotiate from a position of
                strength. We closed under asking and couldn&apos;t be
                happier.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 mb-6">
                Maria Ramirez, First-Time Buyer — Thousand Oaks
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl text-mk-teal">$45K</span>
              <span className="text-sm text-gray-500">saved below asking price</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-rows-2 gap-6">
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Conejo Valley Sellers
              </p>
              <span className="font-display text-3xl text-mk-teal mb-1">98%</span>
              <span className="text-sm text-gray-500">
                of listings sold at or above asking price
              </span>
            </div>
            <div className="bg-gray-100 rounded-xl p-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-gray-900 mb-3">
                Investor Clients
              </p>
              <span className="font-display text-3xl text-mk-teal mb-1">24 days</span>
              <span className="text-sm text-gray-500">
                average days on market for MasterKey listings
              </span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center px-7 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Read our client stories
          </a>
        </div>
      </div>
    </section>
  );
}
