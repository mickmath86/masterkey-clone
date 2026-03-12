import Header from "@/components/Header";
import Hero from "@/components/Hero";
import SocialProof from "@/components/SocialProof";
import FeatureHighlight from "@/components/FeatureHighlight";
import FeatureRows from "@/components/FeatureRows";
import DarkSection from "@/components/DarkSection";
import Benefits from "@/components/Benefits";
import Security from "@/components/Security";
import Departments from "@/components/Departments";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ScrollAnimator from "@/components/ScrollAnimator";

export default function Home() {
  return (
    <>
      <ScrollAnimator />
      <Header />
      <main>
        <Hero />
        <SocialProof />
        <FeatureHighlight />
        <FeatureRows />
        <DarkSection />
        <Benefits />
        <Security />
        <Departments />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
