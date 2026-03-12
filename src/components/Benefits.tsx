import { Search, Globe, Rocket } from "lucide-react";

const benefits = [
  {
    icon: Search,
    title: "Out-research the competition",
    text: "Get precise market answers with data you can trust and smart follow-up analysis that helps you stay ahead of every deal.",
  },
  {
    icon: Globe,
    title: "AI where you already work",
    text: "Have MasterKey answer questions, surface comps, and handle busywork — all from your phone, browser, or CRM integration.",
  },
  {
    icon: Rocket,
    title: "Tackle complex transactions",
    text: "Analyze market data, create listing presentations, run comparables, and plan your next investment — just tell us what you need.",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-mk-mint to-mk-cream text-center">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center p-6">
              <div className="w-12 h-12 flex items-center justify-center mb-4 text-mk-teal">
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-xl text-gray-900 mb-3">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-[320px]">
                {text}
              </p>
            </div>
          ))}
        </div>

        <a
          href="#contact"
          className="inline-flex items-center px-7 py-3 rounded-full bg-mk-teal text-white text-sm font-medium hover:bg-mk-teal/90 transition-colors"
        >
          Get started
        </a>
      </div>
    </section>
  );
}
