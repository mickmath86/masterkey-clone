export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative py-16 md:py-24 text-center text-white overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #4DB6AC 0%, #1A4D4D 60%, #0F2E2E 100%)",
      }}
    >
      {/* Decorative landscape */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[40%] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(232,213,183,0.15) 100%)",
          clipPath:
            "polygon(0 40%, 15% 20%, 30% 35%, 50% 10%, 70% 30%, 85% 15%, 100% 25%, 100% 100%, 0 100%)",
        }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-white mb-8">
          Get started with
          <br />
          MasterKey today
        </h2>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="#contact"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full bg-mk-dark text-white text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Get started
          </a>
          <a
            href="mailto:hello@usemasterkey.com"
            className="inline-flex items-center justify-center px-7 py-3 rounded-full border border-white/40 text-white text-sm font-medium hover:border-white transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
