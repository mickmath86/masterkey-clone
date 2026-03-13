"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketPulseContent from "./MarketPulseContent";
import MarketPulseDashboard from "./MarketPulseDashboard";

export default function MarketPulseWrapper() {
  const [gateCleared, setGateCleared] = useState(false);

  if (gateCleared) {
    return <MarketPulseDashboard />;
  }

  return (
    <>
      <Header />
      <main id="top">
        <MarketPulseContent onGateCleared={() => setGateCleared(true)} />
      </main>
      <Footer />
    </>
  );
}
