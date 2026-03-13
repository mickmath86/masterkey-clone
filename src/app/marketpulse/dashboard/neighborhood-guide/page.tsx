import type { Metadata } from "next";
import { MapPin, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Neighborhood Guide | MarketPulse",
  description: "Explore neighborhoods across Ventura County with data-driven insights.",
};

const neighborhoods = [
  {
    name: "North Ranch",
    city: "Westlake Village",
    medianPrice: "$2,450,000",
    change: "+8.2%",
    schools: "9/10",
    walkScore: 42,
    description: "Gated luxury community with equestrian trails and panoramic mountain views.",
  },
  {
    name: "Dos Vientos",
    city: "Newbury Park",
    medianPrice: "$1,350,000",
    change: "+6.5%",
    schools: "9/10",
    walkScore: 35,
    description: "Master-planned community with top-rated schools and hiking trails.",
  },
  {
    name: "Lynn Ranch",
    city: "Thousand Oaks",
    medianPrice: "$1,050,000",
    change: "+5.8%",
    schools: "8/10",
    walkScore: 48,
    description: "Family-friendly neighborhood with tree-lined streets near the Civic Arts Plaza.",
  },
  {
    name: "Pierpont",
    city: "Ventura",
    medianPrice: "$1,450,000",
    change: "+5.2%",
    schools: "7/10",
    walkScore: 72,
    description: "Beachfront community with craftsman homes and walkable access to the pier.",
  },
  {
    name: "Spanish Hills",
    city: "Camarillo",
    medianPrice: "$1,150,000",
    change: "+4.8%",
    schools: "8/10",
    walkScore: 28,
    description: "Hillside community with panoramic views and proximity to outlet shopping.",
  },
  {
    name: "Oxnard Shores",
    city: "Oxnard",
    medianPrice: "$825,000",
    change: "+3.1%",
    schools: "6/10",
    walkScore: 55,
    description: "Affordable beachfront living with diverse dining and cultural attractions.",
  },
];

export default function NeighborhoodGuidePage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">Neighborhood Guide</h1>
        <p className="text-sm text-gray-500 mt-1">
          Explore top neighborhoods across Ventura County with real-time market data and lifestyle insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {neighborhoods.map((n) => (
          <div
            key={n.name}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-mk-mint flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-mk-teal" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{n.name}</h3>
                  <p className="text-xs text-gray-400">{n.city}</p>
                </div>
              </div>
              <span className="text-xs font-medium text-mk-green flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {n.change}
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              {n.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>
                <span className="font-medium text-gray-900">{n.medianPrice}</span> median
              </span>
              <span>
                Schools: <span className="font-medium text-gray-900">{n.schools}</span>
              </span>
              <span>
                Walk Score: <span className="font-medium text-gray-900">{n.walkScore}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
