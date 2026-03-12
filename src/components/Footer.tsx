const columns = [
  {
    title: "Company",
    links: ["About", "Careers", "Brand Guidelines", "Privacy Policy", "Terms"],
  },
  {
    title: "Services",
    links: ["Buying", "Selling", "Investing", "Development", "Relocation"],
  },
  {
    title: "Markets",
    links: [
      "Thousand Oaks",
      "Westlake Village",
      "Newbury Park",
      "Agoura Hills",
      "Oak Park",
    ],
  },
  {
    title: "Resources",
    links: ["Market Reports", "Buyer's Guide", "Seller's Guide", "Blog", "FAQ"],
  },
  {
    title: "Connect",
    links: ["Instagram", "YouTube", "LinkedIn", "Facebook", "Email"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white/70 py-16">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {col.title}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="block text-sm text-white/50 py-1 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/10 gap-4">
          <span className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} MasterKey Real Estate. DRE #XXXXXXX
          </span>
          <a
            href="https://www.perplexity.ai/computer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            Created with Perplexity Computer
          </a>
        </div>
      </div>
    </footer>
  );
}
