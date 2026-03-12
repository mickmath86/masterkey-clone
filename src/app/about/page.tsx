import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AboutContent from "@/components/about/AboutContent";

export const metadata: Metadata = {
  title: "About Us | MasterKey Real Estate",
  description:
    "How MasterKey is transforming real estate in the Conejo Valley — combining deep local expertise with AI-powered market intelligence to deliver better outcomes for buyers, sellers, and investors.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
