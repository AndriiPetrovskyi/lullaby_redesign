import { useLayoutEffect, useState } from "react";
import AnimatedSection from "../components/AnimatedSection.jsx";
import GiftSlide from "../components/slides/GiftSlide.jsx";
import HandmadeSlide from "../components/slides/HandmadeSlide.jsx";
import ProductInfoSlide from "../components/slides/ProductInfoSlide.jsx";
import SeedsSlide from "../components/slides/SeedsSlide.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useSectionScroll } from "../hooks/useSectionScroll.js";
import MobileGiftSlide from "../mobile/components/slides/GiftSlide.jsx";
import MobileHandmadeSlide from "../mobile/components/slides/HandmadeSlide.jsx";
import MobileProductInfoSlide from "../mobile/components/slides/ProductInfoSlide.jsx";
import MobileSeedsSlide from "../mobile/components/slides/SeedsSlide.jsx";
import "./HomePage.css";

function HomePage() {
  const isMobile = useIsMobile();
  const [navHeight, setNavHeight] = useState(0);
  useSectionScroll(4, { duration: 1600, enabled: !isMobile });

  useLayoutEffect(() => {
    if (isMobile) return;
    const nav = document.querySelector(".navbar");
    if (nav) setNavHeight(nav.offsetHeight);
  }, [isMobile]);

  if (isMobile) {
    return (
      <main className="m-home-sections">
        <section className="m-home-section">
          <MobileProductInfoSlide />
        </section>
        <section className="m-home-section">
          <MobileHandmadeSlide />
        </section>
        <section className="m-home-section">
          <MobileSeedsSlide />
        </section>
        <section className="m-home-section">
          <MobileGiftSlide />
        </section>
      </main>
    );
  }

  return (
    <main className="home-sections">
      <section
        className="home-section home-section--first"
        style={{ "--nav-height": `${navHeight}px` }}
      >
        <AnimatedSection className="home-section-inner" direction={-1}>
          <ProductInfoSlide />
        </AnimatedSection>
      </section>
      <section className="home-section">
        <AnimatedSection className="home-section-inner" direction={1}>
          <HandmadeSlide />
        </AnimatedSection>
      </section>
      <section className="home-section">
        <AnimatedSection className="home-section-inner" direction={-1}>
          <SeedsSlide />
        </AnimatedSection>
      </section>
      <section className="home-section">
        <AnimatedSection className="home-section-inner" direction={1}>
          <GiftSlide />
        </AnimatedSection>
      </section>
    </main>
  );
}

export default HomePage;
