import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import ToolCatalog from "@/components/landing/ToolCatalog";
import Features from "@/components/landing/Features";
import Testimonials from "@/components/landing/Testimonials";
import CtaBand from "@/components/landing/CtaBand";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--beige)" }}>
      {/* 1. Floating Nav Card (sticky) */}
      <NavBar />

      <main>
        {/* 2. Hero on warm beige background */}
        <Hero />

        {/* 3. Popular Catalog on light gray (2x2 grid) */}
        <ToolCatalog />

        {/* 4. Why choose us on beige */}
        <Features />

        {/* 5. Creator Testimonials on light gray */}
        <Testimonials />

        {/* 6. CTA Band on full-width light blue */}
        <CtaBand />
      </main>

      {/* 7. Footer on beige */}
      <Footer />
    </div>
  );
}
