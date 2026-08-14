import productImage from "../../assets/slider/1.jpg";
import "./Slide.css";
import "./ProductInfoSlide.css";

function ProductInfoSlide() {
  return (
    <div className="slide-content product-info-slide">
      <div className="slide-content-text">
        <p className="body-text mb-lg">Some moments don't need words.</p>
      </div>
      <div className="product-info-slide-visual">
        <div className="slide-content-image">
          <img src={productImage} alt="Товар" />
        </div>
        <div className="product-info-slide-title">
          <p className="product-info-slide-title-main">Lullaby</p>
          <p className="product-info-slide-title-sub">rituals</p>
        </div>
      </div>
      <div className="product-info-slide-caption">
        <p>
          Just a gentle glow, a familiar scent, and the feeling of being{" "}
          <span className="product-info-slide-home">home</span>
        </p>
      </div>
    </div>
  );
}

export default ProductInfoSlide;
