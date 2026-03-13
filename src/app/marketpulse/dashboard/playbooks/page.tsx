import type { Metadata } from "next";
import { BookOpen, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Playbooks | MarketPulse",
  description: "Strategic real estate playbooks for Ventura County markets.",
};

const playbooks = [
  {
    title: "First-Time Buyer Playbook",
    description: "Step-by-step guide for navigating Ventura County as a first-time homebuyer. Covers pre-approval, neighborhoods, and negotiation tactics.",
    tag: "Buyer",
    tagColor: "bg-mk-blue/10 text-mk-blue",
  },
  {
    title: "Seller's Market Strategy",
    description: "Maximize your listing price in a competitive seller's market. Pricing strategies, staging tips, and offer evaluation frameworks.",
    tag: "Seller",
    tagColor: "bg-mk-green/10 text-mk-green",
  },
  {
    title: "Investment Property Analysis",
    description: "Evaluate rental yields, cap rates, and appreciation potential across Ventura County submarkets.",
    tag: "Investor",
    tagColor: "bg-purple-100 text-purple-700",
  },
  {
    title: "Luxury Market Playbook",
    description: "Navigate the $2M+ market in Westlake Village and North Ranch. Unique considerations for high-value transactions.",
    tag: "Luxury",
    tagColor: "bg-amber-50 text-amber-700",
  },
];

export default function PlaybooksPage() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Playbooks</h1>
          <p className="text-sm text-gray-500 mt-1">
            Strategic guides and frameworks for every type of real estate transaction.
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-mk-teal rounded-lg hover:bg-mk-teal/90 transition-colors">
          <Plus className="w-4 h-4" />
          New Playbook
        </button>
      </div>

      <div className="grid gap-4">
        {playbooks.map((pb) => (
          <div
            key={pb.title}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 group-hover:bg-mk-mint transition-colors">
                <BookOpen className="w-5 h-5 text-mk-teal" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {pb.title}
                  </h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${pb.tagColor}`}>
                    {pb.tag}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {pb.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
