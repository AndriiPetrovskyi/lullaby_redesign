import heroSmall from "../../assets/sun-1280.webp";
import heroMedium from "../../assets/sun-1920.webp";
import heroLarge from "../../assets/sun-2400.webp";
import "./HomeRow.css";
import "./ProductInfoSlide.css";

function ProductInfoSlide() {
  return (
    <div className="home-hero">
      <img
        className="home-hero-image"
        src={heroMedium}
        srcSet={`${heroSmall} 1280w, ${heroMedium} 1920w, ${heroLarge} 2400w`}
        sizes="100vw"
        alt="Lullaby candles in handmade gypsum vessels"
        width="2400"
        height="1792"
        fetchPriority="high"
      />
      <div className="home-hero-text">
        <div className="home-row-text">
          <p className="home-row-eyebrow">Some moments don't need words.</p>
          <h1 className="home-row-title">
            <span className="home-row-title-bold home-hero-title-main">
              Lullaby
            </span>
            <span className="home-row-title-script home-hero-title-sub">
              rituals
            </span>
          </h1>
          <p className="home-row-caption">
            Just a gentle glow, a familiar scent, and the feeling of being home.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductInfoSlide;
