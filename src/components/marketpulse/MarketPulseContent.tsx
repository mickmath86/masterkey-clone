"use client";

import { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Home,
  DollarSign,
  MapPin,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ───────── validation helpers ───────── */
function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValidPhone(v: string) {
  if (!v.trim()) return true; // optional
  const digits = v.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

/* ───────── feature cards data ───────── */
const features = [
  {
    icon: TrendingUp,
    title: "Real-time pricing trends",
    body: "Track median prices, price-per-square-foot, and appreciation rates updated monthly for every neighborhood in the Conejo Valley.",
  },
  {
    icon: Home,
    title: "Inventory & days-on-market",
    body: "See how fast homes sell, how many are available, and whether the market favors buyers or sellers — all in a single dashboard.",
  },
  {
    icon: DollarSign,
    title: "Investment opportunity scores",
    body: "Our AI analyzes rental yields, appreciation potential, and demand indicators to surface neighborhoods with the strongest ROI.",
  },
  {
    icon: MapPin,
    title: "Hyper-local market maps",
    body: "Interactive maps show price heat, recent sales, and upcoming listings block-by-block across Thousand Oaks, Westlake Village, and beyond.",
  },
];

/* ───────── example questions ───────── */
const questions = [
  "What is the median home price in Thousand Oaks right now?",
  "Which Conejo Valley ZIP code appreciated the most last year?",
  "How does Westlake Village inventory compare to Newbury Park?",
  "What are the key trends in luxury home sales in Oak Park?",
  "Which neighborhoods have the fastest days-on-market?",
  "How do interest rate changes affect the local market?",
  "What is the price-per-sqft trend in Agoura Hills?",
];

/* ───────── workspace cards ───────── */
const workspaces = [
  {
    title: "Neighborhood comparison",
    body: "Compare pricing, schools, walkability, and appreciation across Conejo Valley neighborhoods side by side.",
    cta: "Explore report",
    gradient: "from-mk-teal to-mk-teal-light",
  },
  {
    title: "Monthly market snapshot",
    body: "Get a concise summary of new listings, closings, median prices, and inventory shifts each month.",
    cta: "View snapshot",
    gradient: "from-mk-teal-light to-emerald-400",
  },
  {
    title: "Investment analysis",
    body: "Dive into cap rates, rental demand, and value-add opportunities across the Conejo Valley market.",
    cta: "Run analysis",
    gradient: "from-emerald-600 to-mk-teal",
  },
  {
    title: "Seller's pricing guide",
    body: "Data-backed recommendations for list price, timing, and expected days-on-market for your property.",
    cta: "Get pricing",
    gradient: "from-mk-blue to-mk-teal-light",
  },
];

/* ───────── main component ───────── */
export default function MarketPulseContent() {
  return (
    <>
      <HeroGate />
      <FeaturesSection />
      <QuestionsSection />
      <TestimonialSection />
      <WorkspacesSection />
      <FinalCTA />
    </>
  );
}

/* ═══════════════════════════════════════
   HERO – email gate form
   ═══════════════════════════════════════ */
function HeroGate() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[e.target.name];
        return copy;
      });
    }
  }

  function validate() {
    const next: Record<string, string> = {};
    if (!form.firstName.trim()) next.firstName = "First name is required";
    if (!form.lastName.trim()) next.lastName = "Last name is required";
    if (!form.email.trim()) {
      next.email = "Email is required";
    } else if (!isValidEmail(form.email)) {
      next.email = "Please enter a valid email";
    }
    if (form.phone.trim() && !isValidPhone(form.phone)) {
      next.phone = "Please enter a valid phone number";
    }
    return next;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setSubmitted(true);
  }

  return (
    <section className="relative bg-mk-mint pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* decorative gradient blurs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-mk-teal-light/20 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-mk-green/10 blur-3xl" />

      <div className="relative max-w-[1200px] mx-auto px-6 text-center">
        {/* eyebrow */}
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-mk-teal mb-4">
          MasterKey MarketPulse
        </p>

        {/* headline */}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] text-gray-900 leading-[1.1] mb-6">
          Your Conejo Valley market intelligence
        </h1>

        {/* subheadline */}
        <p className="max-w-[720px] mx-auto text-lg sm:text-xl text-gray-600 leading-relaxed mb-10">
          Get instant access to AI-powered market data, pricing trends, and
          neighborhood insights — delivered to your inbox and always available on
          demand.
        </p>

        {/* gate card */}
        <div className="max-w-[540px] mx-auto">
          {submitted ? (
            <div className="bg-white rounded-2xl shadow-lg px-8 py-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-mk-green mx-auto mb-4" />
              <h2 className="font-display text-2xl text-gray-900 mb-2">
                You&apos;re in
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                Welcome to MarketPulse, {form.firstName}. Check your email for
                your first market report.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              className="bg-white rounded-2xl shadow-lg px-8 py-10"
            >
              <h2 className="font-display text-xl text-gray-900 mb-6">
                Unlock your market dashboard
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div className="text-left">
                  <label
                    htmlFor="firstName"
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    First name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                      errors.firstName
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Jane"
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div className="text-left">
                  <label
                    htmlFor="lastName"
                    className="block text-xs font-medium text-gray-500 mb-1"
                  >
                    Last name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                      errors.lastName
                        ? "border-red-400 focus:ring-red-300"
                        : "border-gray-200"
                    }`}
                    placeholder="Smith"
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone (optional) */}
              <div className="text-left mb-4">
                <label
                  htmlFor="phone"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Phone{" "}
                  <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                    errors.phone
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200"
                  }`}
                  placeholder="(805) 555-1234"
                />
                {errors.phone && (
                  <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="text-left mb-6">
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-gray-500 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:ring-2 focus:ring-mk-teal/30 ${
                    errors.email
                      ? "border-red-400 focus:ring-red-300"
                      : "border-gray-200"
                  }`}
                  placeholder="jane@example.com"
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-mk-teal text-white text-sm font-medium px-8 py-3.5 hover:bg-mk-teal/90 transition-colors"
              >
                Get instant access
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
                Free access. No credit card required. We respect your privacy —
                unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   FEATURES — 2×2 grid
   ═══════════════════════════════════════ */
function FeaturesSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-center mb-16 leading-tight">
          Precise insights for every real estate decision
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 mb-14">
          {features.map((f) => (
            <div key={f.title} className="flex gap-5">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-mk-mint flex items-center justify-center">
                <f.icon className="w-5 h-5 text-mk-teal" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {f.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#top"
            className="inline-flex items-center px-8 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   QUESTIONS — horizontal scroll cards
   ═══════════════════════════════════════ */
function QuestionsSection() {
  return (
    <section className="py-24 lg:py-32 bg-mk-cream">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-center mb-12 leading-tight">
          Get instant answers to your market questions
        </h2>

        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {questions.map((q, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[340px] sm:w-[420px] snap-start rounded-2xl border border-gray-200 bg-white px-6 py-6 hover:shadow-md transition-shadow"
            >
              <p className="text-sm sm:text-base text-gray-800 leading-relaxed">
                {q}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   TESTIMONIAL
   ═══════════════════════════════════════ */
function TestimonialSection() {
  return (
    <section className="py-24 lg:py-32 bg-mk-lavender">
      <div className="max-w-[880px] mx-auto px-6 text-center">
        <blockquote className="font-display text-2xl sm:text-3xl lg:text-[34px] text-gray-900 leading-snug">
          &ldquo;MarketPulse gave us clarity we never had before. We listed at
          the right price, received multiple offers in four days, and closed
          above asking — all backed by data our agent showed us in real
          time.&rdquo;
        </blockquote>
        <p className="mt-8 text-sm font-medium text-gray-600">
          Sarah & David M., Thousand Oaks sellers
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   WORKSPACES — carousel cards
   ═══════════════════════════════════════ */
function WorkspacesSection() {
  const [offset, setOffset] = useState(0);
  const max = workspaces.length - 1;

  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-900 text-center mb-4 leading-tight">
          Your data, organized by goal
        </h2>
        <p className="text-center text-gray-500 text-lg mb-14 max-w-[640px] mx-auto">
          Dedicated workspaces for every real estate objective.
        </p>

        <div className="relative">
          {/* carousel track */}
          <div className="flex gap-6 overflow-hidden">
            {workspaces.map((w, i) => (
              <div
                key={w.title}
                className="flex-shrink-0 w-[300px] sm:w-[340px] rounded-2xl border border-gray-100 overflow-hidden transition-transform duration-300"
                style={{
                  transform: `translateX(-${offset * 356}px)`,
                }}
              >
                {/* gradient artwork placeholder */}
                <div
                  className={`h-44 bg-gradient-to-br ${w.gradient} flex items-end p-5`}
                >
                  <BarChart3 className="w-8 h-8 text-white/60" />
                </div>
                <div className="p-6">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {w.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {w.body}
                  </p>
                  <span className="text-sm font-medium text-mk-teal inline-flex items-center gap-1">
                    {w.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* arrows */}
          {offset > 0 && (
            <button
              onClick={() => setOffset((p) => Math.max(0, p - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>
          )}
          {offset < max && (
            <button
              onClick={() => setOffset((p) => Math.min(max, p + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="py-24 lg:py-32 bg-mk-mint">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-gray-900 leading-tight mb-8">
          Start making data-driven decisions today
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#top"
            className="inline-flex items-center px-8 py-3.5 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
          >
            Get started
          </a>
          <a
            href="/#contact"
            className="inline-flex items-center px-8 py-3.5 rounded-full border-2 border-mk-teal text-mk-teal text-sm font-medium hover:bg-mk-teal/5 transition-colors"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
