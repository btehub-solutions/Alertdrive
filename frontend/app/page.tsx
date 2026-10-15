import Navbar from "@/components/landing/navbar";
import Hero from "@/components/landing/hero";
import Mission from "@/components/landing/mission";
import FeatureShowcase from "@/components/landing/feature-showcase";
import EcosystemCards from "@/components/landing/ecosystem-cards";
import NewsSection from "@/components/landing/news-section";
import PlatformAccordion from "@/components/landing/platform-accordion";
import ContactSection from "@/components/landing/contact-section";
import Footer from "@/components/landing/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Mission />
      <FeatureShowcase />
      <EcosystemCards />
      <NewsSection />
      <PlatformAccordion />
      <ContactSection />
      <Footer />
    </main>
  );
}
