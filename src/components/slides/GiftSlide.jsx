import { motion } from "framer-motion";
import productImage from "../../assets/box.jpg";
import { fadeInUp, scaleDown } from "../../utils/scrollAnimation.js";
import "./GiftSlide.css";

function GiftSlide() {
  return (
    <div className="gift-slide">
      <div className="gift-slide-text">
        <motion.p className="body-text gift-slide-tagline" {...fadeInUp()}>
          The best gifts say what words can't.
        </motion.p>
        <div className="gift-slide-title">
          <motion.p className="gift-slide-title-bold" {...fadeInUp(0.1)}>
            The first impression
          </motion.p>
          <motion.p className="gift-slide-title-script" {...fadeInUp(0.2)}>
            is a part of
          </motion.p>
          <motion.p
            className="gift-slide-title-bold gift-slide-title-bold--second"
            {...fadeInUp(0.3)}>
            the gift
          </motion.p>
        </div>
        <motion.p className="body-text gift-slide-caption" {...fadeInUp(0.4)}>
          Each candle arrives in a handcrafted keepsake box, created with the
          same care as what's inside.
        </motion.p>
      </div>
      <div className="gift-slide-image">
        <motion.img src={productImage} alt="Gift" {...scaleDown()} />
      </div>
    </div>
  );
}

export default GiftSlide;
