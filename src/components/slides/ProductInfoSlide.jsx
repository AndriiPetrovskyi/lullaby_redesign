import { motion } from "framer-motion";
import productImage from "../../assets/slider/1.jpg";
import { fadeInUp, scaleDown } from "../../utils/scrollAnimation.js";
import "./Slide.css";
import "./ProductInfoSlide.css";

function ProductInfoSlide() {
  return (
    <div className="slide-content product-info-slide">
      <div className="slide-content-text">
        <motion.p className="body-text mb-lg" {...fadeInUp()}>
          Some moments don't need words.
        </motion.p>
      </div>
      <div className="product-info-slide-visual">
        <div className="slide-content-image">
          <motion.img src={productImage} alt="Товар" {...scaleDown()} />
        </div>
        <div className="product-info-slide-title">
          <motion.p className="product-info-slide-title-main" {...fadeInUp()}>
            Lullaby
          </motion.p>
          <motion.p className="product-info-slide-title-sub" {...fadeInUp(0.1)}>
            rituals
          </motion.p>
        </div>
      </div>
      <div className="product-info-slide-caption">
        <motion.p {...fadeInUp(0.2)}>
          Just a gentle glow, a familiar scent, and the feeling of being{" "}
          <span className="product-info-slide-home">home</span>
        </motion.p>
      </div>
    </div>
  );
}

export default ProductInfoSlide;
