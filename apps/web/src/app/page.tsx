import Nav from "@/components/nav";
import Hero from "@/components/hero";
import PainStrip from "@/components/pain-strip";
import CommandsSection from "@/components/commands-section";
import HowItWorks from "@/components/how-it-works";
import AgentsStrip from "@/components/agents-strip";
import PropsSection from "@/components/props-section";
import CTASection from "@/components/cta-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <div className="grid-bg" />
      <div style={{ position: "relative", zIndex: 1 }}>
        <Nav />
        <Hero />
        <PainStrip />
        <CommandsSection />
        <HowItWorks />
        <AgentsStrip />
        <PropsSection />
        <CTASection />
        <Footer />
      </div>
    </>
  );
}
