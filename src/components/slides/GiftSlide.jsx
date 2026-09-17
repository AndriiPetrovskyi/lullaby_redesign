import { motion } from 'framer-motion'
import productImage from '../../assets/slider/1.jpg'
import { fadeInUp, scaleDown } from '../../utils/scrollAnimation.js'
import './Slide.css'
import './GiftSlide.css'

function GiftSlide() {
  return (
    <div className="slide-content gift-slide">
      <div className="gift-slide-row">
        <div className="gift-slide-title">
          <motion.p className="body-text gift-slide-tagline" {...fadeInUp()}>
            The best gifts say what words can't.
          </motion.p>
          <motion.p className="gift-slide-title-bold" {...fadeInUp(0.1)}>
            The first impression
          </motion.p>
          <motion.p className="gift-slide-title-script" {...fadeInUp(0.2)}>
            is a part of
          </motion.p>
          <motion.p
            className="gift-slide-title-bold gift-slide-title-bold--second"
            {...fadeInUp(0.3)}
          >
            the gift
          </motion.p>
        </div>
        <div className="slide-content-image">
          <motion.img src={productImage} alt="Gift" {...scaleDown()} />
        </div>
      </div>
      <div className="gift-slide-caption">
        <motion.p className="body-text" {...fadeInUp(0.4)}>
          Each candle arrives in a handcrafted keepsake box, created with the
          same care as what's inside.
        </motion.p>
      </div>
    </div>
  )
}

export default GiftSlide
