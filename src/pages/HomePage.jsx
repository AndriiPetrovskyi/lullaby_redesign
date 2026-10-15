import Seo from "../components/Seo.jsx";
import BestsellersSlide from "../components/slides/BestsellersSlide.jsx";
import GiftSlide from "../components/slides/GiftSlide.jsx";
import HandmadeSlide from "../components/slides/HandmadeSlide.jsx";
import ProductInfoSlide from "../components/slides/ProductInfoSlide.jsx";
import SeedsSlide from "../components/slides/SeedsSlide.jsx";
import { SITE_NAME, absoluteUrl } from "../config/seo.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import MobileBestsellersSlide from "../mobile/components/slides/BestsellersSlide.jsx";
import MobileGiftSlide from "../mobile/components/slides/GiftSlide.jsx";
import MobileHandmadeSlide from "../mobile/components/slides/HandmadeSlide.jsx";
import MobileProductInfoSlide from "../mobile/components/slides/ProductInfoSlide.jsx";
import MobileSeedsSlide from "../mobile/components/slides/SeedsSlide.jsx";
import "./HomePage.css";

const HOME_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
  sameAs: [],
};

function HomePage() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <>
        <Seo path="/" jsonLd={HOME_JSON_LD} />
        <main className="m-home-sections">
          <section className="m-home-section">
            <MobileProductInfoSlide />
          </section>
          <section className="m-home-section m-home-section--auto">
            <MobileBestsellersSlide />
          </section>
          <section className="m-home-section">
            <MobileGiftSlide />
          </section>
          <section className="m-home-section">
            <MobileSeedsSlide />
          </section>
          <section className="m-home-section">
            <MobileHandmadeSlide />
          </section>
        </main>
      </>
    );
  }

  return (
    <>
      <Seo path="/" jsonLd={HOME_JSON_LD} />
      <main className="home-sections">
        <section className="home-section home-section--hero">
          <ProductInfoSlide />
        </section>
        <section className="home-section">
          <BestsellersSlide />
        </section>
        <section className="home-section">
          <GiftSlide />
        </section>
        <section className="home-section">
          <SeedsSlide />
        </section>
        <section className="home-section">
          <HandmadeSlide />
        </section>
      </main>
    </>
  );
}

export default HomePage;
