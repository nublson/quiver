import AgentsStrip from "@/components/agents-strip";
import CommandsSection from "@/components/commands-section";
import CTASection from "@/components/cta-section";
import Hero from "@/components/hero";
import HowItWorks from "@/components/how-it-works";
import PainStrip from "@/components/pain-strip";
import PropsSection from "@/components/props-section";

export default function Home() {
  return (
    <div className="relative z-[1]">
      <Hero />
      <PainStrip />
      <CommandsSection />
      <HowItWorks />
      <AgentsStrip />
      <PropsSection />
      <CTASection />
    </div>
  );
}
