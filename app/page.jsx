import GaPageView from "../src/components/GaPageView.jsx";
import AboutSection from "../src/components/home/AboutSection.jsx";
import BestsellersSection from "../src/components/home/BestsellersSection.jsx";
import FaqSection from "../src/components/home/FaqSection.jsx";
import FeatureSection from "../src/components/home/FeatureSection.jsx";
import GiftSection from "../src/components/home/GiftSection.jsx";
import HeroSection from "../src/components/home/HeroSection.jsx";
import StagesSection from "../src/components/home/StagesSection.jsx";
import { absoluteUrl, SITE_NAME } from "../src/config/seo.js";
import { pageMetadata } from "../src/lib/metadata.js";

export const metadata = pageMetadata({ path: "/" });
const TITLE = metadata.title;

// The bestsellers come from the backend; refreshed within five minutes.
export const revalidate = 300;

const ORGANIZATION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  sameAs: [],
};

// Each section is its own component in src/components/home/; reorder them here.
export default function HomePage() {
  return (
    <main className="container">
      <GaPageView title={TITLE} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
      />
      <HeroSection />
      <StagesSection />
      <GiftSection />
      <FeatureSection />
      <AboutSection />
      <BestsellersSection />
      <FaqSection />
    </main>
  );
}
