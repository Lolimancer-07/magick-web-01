import NavBar from "@/components/landing/NavBar";
import Hero from "@/components/landing/Hero";
import PipelineTicker from "@/components/landing/PipelineTicker";
import Features from "@/components/landing/Features";
import ToolCatalog from "@/components/landing/ToolCatalog";
import CtaBand from "@/components/landing/CtaBand";
import Footer from "@/components/landing/Footer";

export const metadata = {
  title: "Magick Studio — Pro In-Browser Image Editor",
  description:
    "Edit images with precision using the full power of ImageMagick. 100% private, runs entirely inside your browser via WebAssembly.",
};

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--ink)" }}>
      {/* Top sticky navigation */}
      <NavBar />

      <main>
        {/* Hero section */}
        <Hero />

        {/* Pipeline Ticker */}
        <PipelineTicker />

        {/* Features (Built for Serious Editors, Stats Card, Privacy Architecture) */}
        <Features />

        {/* Full Tool Catalog by category */}
        <ToolCatalog />

        {/* Call to action */}
        <CtaBand />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
