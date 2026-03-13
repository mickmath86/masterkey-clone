"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MarketPulseContent from "./MarketPulseContent";

export default function MarketPulseWrapper() {
  const router = useRouter();

  function handleGateCleared() {
    router.push("/marketpulse/dashboard");
  }

  return (
    <>
      <Header />
      <main id="top">
        <MarketPulseContent onGateCleared={handleGateCleared} />
      </main>
      <Footer />
    </>
  );
}
