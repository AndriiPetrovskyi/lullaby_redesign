import processVideo from "../../../assets/process.mp4";
import MutableVideo from "../../../components/MutableVideo.jsx";
import "./Slide.css";
import "./ProductInfoSlide.css";

function ProductInfoSlide() {
  return (
    <div className="m-slide-content m-product-info-slide">
      <MutableVideo className="m-slide-bg-image" src={processVideo} />

      <p className="m-product-info-slide-tagline">
        Some moments don't need words.
      </p>

      <div className="m-product-info-slide-title">
        <span className="m-product-info-slide-title-main">Lullaby</span>
        <span className="m-product-info-slide-title-sub">rituals</span>
      </div>

      <p className="m-product-info-slide-caption">
        Just a gentle glow, a familiar scent,
        <br />
        and the feeling of being{" "}
        <span className="m-product-info-slide-home">home</span>
      </p>
    </div>
  );
}

export default ProductInfoSlide;
