import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/sections/Hero";
import WhatIsAMR from "../components/sections/WhatIsAMR";
import RationalUse from "../components/sections/RationalUse";
import Impact from "../components/sections/Impact";
import HowToHelp from "../components/sections/HowToHelp";
import SDGSection from "../components/sections/SDGSection";
import VSSplitSection from "../components/sections/VSSplitSection";
import HomeParticles from "../components/sections/HomeParticles";

export default function Home() {
  return (
    <>
      <Navbar />
      {/* pt-16 offsets the fixed navbar (h-16 = 64 px) */}
      <div className="relative pt-16" style={{ overflowX: "clip" }}>
        <HomeParticles />
        <div className="relative z-10">
          <main>
            <Hero />
            <WhatIsAMR />
            <RationalUse />
            <Impact />
            <HowToHelp />
            <VSSplitSection />
            <SDGSection />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
