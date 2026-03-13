import type { Metadata } from "next";
import { Newspaper, ExternalLink, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "News | MarketPulse",
  description: "Latest real estate news and market updates for Ventura County.",
};

const newsItems = [
  {
    title: "Ventura County Home Sales Rise 12% in February as Inventory Tightens",
    source: "VC Star",
    date: "Mar 11, 2026",
    category: "Market Data",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
    url: "#",
  },
  {
    title: "New Mixed-Use Development Approved for Downtown Ventura Corridor",
    source: "Pacific Coast Business Times",
    date: "Mar 10, 2026",
    category: "Development",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
    url: "#",
  },
  {
    title: "Mortgage Rates Dip Below 6% for First Time Since October",
    source: "Mortgage News Daily",
    date: "Mar 9, 2026",
    category: "Rates",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    url: "#",
  },
  {
    title: "Westlake Village Named Top Suburb for Families in California",
    source: "Niche.com",
    date: "Mar 8, 2026",
    category: "Rankings",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=250&fit=crop",
    url: "#",
  },
  {
    title: "California Housing Affordability Index Reaches 5-Year Low",
    source: "CAR",
    date: "Mar 7, 2026",
    category: "Analysis",
    image: "https://images.unsplash.com/photo-1582407947092-75c0aa1d0bde?w=400&h=250&fit=crop",
    url: "#",
  },
  {
    title: "Commercial Real Estate Recovery Continues in Thousand Oaks Office Market",
    source: "CoStar",
    date: "Mar 6, 2026",
    category: "Commercial",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
    url: "#",
  },
];

export default function NewsPage() {
  return (
    <div className="p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-gray-900">News</h1>
        <p className="text-sm text-gray-500 mt-1">
          Latest real estate news and market updates relevant to Ventura County.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {newsItems.map((item, idx) => (
          <a
            key={idx}
            href={item.url}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="aspect-[16/10] bg-gray-100 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {item.category}
                </span>
              </div>
              <h3 className="text-sm font-medium text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-mk-teal transition-colors">
                {item.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{item.source}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {item.date}
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
