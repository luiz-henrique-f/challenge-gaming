import { Link } from "@tanstack/react-router";
import { Footer } from "@/components/global/footer";
import { PreviewSection } from "./components/preview-section";
import { Features } from "./components/features";
import { Hero } from "./components/hero";
import { CtaFinal } from "./components/cta-final";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0B0F19] via-[#0F172A] to-[#111827] text-gray-100">
      <Hero />
      <Features />
      <PreviewSection />
      <CtaFinal />
      <Footer />
    </div>
  );
}
