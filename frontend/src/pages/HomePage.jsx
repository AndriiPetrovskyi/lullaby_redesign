import { Link } from "react-router-dom";
import GiftSlide from "../components/slides/GiftSlide.jsx";
import HandmadeSlide from "../components/slides/HandmadeSlide.jsx";
import ProductInfoSlide from "../components/slides/ProductInfoSlide.jsx";
import SeedsSlide from "../components/slides/SeedsSlide.jsx";
import Slider from "../components/Slider.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import MobileGiftSlide from "../mobile/components/slides/GiftSlide.jsx";
import MobileHandmadeSlide from "../mobile/components/slides/HandmadeSlide.jsx";
import MobileProductInfoSlide from "../mobile/components/slides/ProductInfoSlide.jsx";
import MobileSeedsSlide from "../mobile/components/slides/SeedsSlide.jsx";
import MobileSlider from "../mobile/components/Slider.jsx";
import "./HomePage.css";

const slides = [
  <ProductInfoSlide />,
  <HandmadeSlide />,
  <SeedsSlide />,
  <GiftSlide />,
];

const mobileSlides = [
  <MobileProductInfoSlide />,
  <MobileHandmadeSlide />,
  <MobileSeedsSlide />,
  <MobileGiftSlide />,
];

function HomePage() {
  const isMobile = useIsMobile();

  return (
    <main>
      <header className="home-header">
        {isMobile ? (
          <MobileSlider slides={mobileSlides} />
        ) : (
          <Slider slides={slides} />
        )}
      </header>
      {/* <h1 className="h1-heading">Головна сторінка</h1>
      <Link to="/products">
        <button type="button">Усі товари</button>
      </Link> */}
    </main>
  );
}

export default HomePage;
