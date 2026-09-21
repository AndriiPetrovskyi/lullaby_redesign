import { motion } from "framer-motion";
import productImage from "../../assets/sun.jpeg";
import { fadeInUp, scaleDown } from "../../utils/scrollAnimation.js";
import "./ProductInfoSlide.css";

function ProductInfoSlide() {
  return (
    <div className="product-info-slide">
      <div className="product-info-slide-image">
        <motion.img src={productImage} alt="Product" {...scaleDown()} />
      </div>
      <div className="product-info-slide-overlay">
        <motion.p
          className="body-text product-info-slide-intro"
          {...fadeInUp()}>
          Some moments don't need words.
        </motion.p>
        <div className="product-info-slide-title">
          <motion.p className="product-info-slide-title-main" {...fadeInUp()}>
            Lullaby
          </motion.p>
          <motion.p className="product-info-slide-title-sub" {...fadeInUp(0.1)}>
            rituals
          </motion.p>
        </div>
        <motion.p className="product-info-slide-caption" {...fadeInUp(0.2)}>
          Just a gentle glow, a familiar scent, and the feeling of being{" "}
          <span className="product-info-slide-home">home</span>
        </motion.p>
      </div>
    </div>
  );
}

export default ProductInfoSlide;
