import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import Hero from "../components/sections/Hero";
import WhatIsAMR from "../components/sections/WhatIsAMR";
import RationalUse from "../components/sections/RationalUse";
import Impact from "../components/sections/Impact";
import HowToHelp from "../components/sections/HowToHelp";
import SupportWallPreview from "../components/sections/SupportWallPreview";
import CampaignGalleryPreview from "../components/sections/CampaignGalleryPreview";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatIsAMR />
        <RationalUse />
        <Impact />
        <HowToHelp />
        <SupportWallPreview />
        <CampaignGalleryPreview />
      </main>
      <Footer />
    </>
  );
}
