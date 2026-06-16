import EntryCurtain from "@/components/EntryCurtain";
import Hero from "@/components/Hero";
import Manifesto from "@/components/Manifesto";
import ServicesConstellation from "@/components/ServicesConstellation";
import ServiceSlider from "@/components/ServiceSlider";
import StudioInfo from "@/components/StudioInfo";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <EntryCurtain />
      {/* Layered hero: empty studio plate + dropping camera + light stand that slides in. */}
      <Hero />
      {/* Div 2 — the "why" manifesto. */}
      <Manifesto />
      {/* Div 3 — "What We Capture": services as a tilted constellation. */}
      <ServicesConstellation />
      {/* Div 4 — services slider. */}
      <ServiceSlider />
      {/* Studio info / credibility band. */}
      <StudioInfo />
      <Footer />
    </main>
  );
}
