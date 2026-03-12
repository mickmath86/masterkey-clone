import {
  ShieldCheck,
  Lock,
  Clock,
  UserPlus,
  KeyRound,
  Bell,
} from "lucide-react";

const cards = [
  {
    icon: ShieldCheck,
    title: "Licensed & Insured",
    text: "Full DRE licensure with E&O coverage. Peace of mind with industry-leading professional standards.",
  },
  {
    icon: Lock,
    title: "Client confidentiality",
    text: "We never share your financial information. All client data is handled with strict privacy protocols.",
  },
  {
    icon: Clock,
    title: "Transparent timelines",
    text: "Real-time transaction tracking with proactive updates at every milestone. Never wonder where your deal stands.",
  },
  {
    icon: UserPlus,
    title: "Dedicated team",
    text: "A single point of contact backed by specialists in negotiation, contracts, and market analytics.",
  },
  {
    icon: KeyRound,
    title: "Secure transactions",
    text: "Wire fraud prevention, secure document signing, and verified escrow partnerships for every closing.",
  },
  {
    icon: Bell,
    title: "Proactive communication",
    text: "Automated alerts for new listings, price changes, and market shifts tailored to your criteria.",
  },
];

export default function Security() {
  return (
    <section className="py-16 md:py-24 bg-mk-mint">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] text-gray-900 mb-4">
            Your investment, fully protected.
          </h2>
          <p className="text-base text-gray-500 max-w-[540px] mx-auto">
            At MasterKey, we safeguard every transaction with enterprise-grade
            processes and professional standards.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {cards.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white rounded-xl p-6 border border-gray-200"
            >
              <div className="w-10 h-10 mb-4 text-mk-teal">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                {title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-2.5 rounded-full border border-gray-300 text-gray-900 text-sm font-medium hover:border-mk-teal hover:text-mk-teal transition-colors"
          >
            Learn more about our process
          </a>
        </div>
      </div>
    </section>
  );
}
