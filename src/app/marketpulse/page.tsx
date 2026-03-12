import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketPulseContent from "@/components/marketpulse/MarketPulseContent";

export const metadata: Metadata = {
  title: "MarketPulse | MasterKey Real Estate",
  description:
    "AI-powered market intelligence for the Conejo Valley. Get real-time pricing trends, neighborhood insights, and data-driven reports delivered to your inbox.",
};

export default function MarketPulsePage() {
  return (
    <>
      <Header />
      <main id="top">
        <MarketPulseContent />
      </main>
      <Footer />
    </>
  );
}
