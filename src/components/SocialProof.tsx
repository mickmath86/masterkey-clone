const logos = [
  "Zillow", "Realtor.com", "Compass", "Keller Williams",
  "Redfin", "RE/MAX", "Coldwell Banker", "Century 21",
  "Sotheby's", "eXp Realty",
];

export default function SocialProof() {
  // Duplicate for seamless scrolling
  const doubledLogos = [...logos, ...logos];

  return (
    <section className="py-12 text-center overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6">
        <p className="text-base text-gray-400 mb-10">
          Trusted by clients navigating Southern California&rsquo;s top markets
        </p>
      </div>

      <div className="relative">
        <div className="logo-carousel flex gap-16 items-center w-max">
          {doubledLogos.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-sm font-semibold tracking-wider uppercase text-gray-300 whitespace-nowrap select-none"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
