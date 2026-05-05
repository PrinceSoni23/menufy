import { Header } from "@/components/common/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/common/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-900">
      <Header />
      <div className="pt-16">
        <Hero />
        <Features />
        <Pricing />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}

