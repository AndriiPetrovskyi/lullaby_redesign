import { motion } from 'framer-motion'
import productImage from '../../assets/slider/3.png'
import { fadeInUp, scaleDown } from '../../utils/scrollAnimation.js'
import './Slide.css'
import './SeedsSlide.css'

function SeedsSlide() {
  return (
    <div className="slide-content seeds-slide">
      <div className="slide-content-text">
        <motion.p className="body-text" {...fadeInUp()}>
          When one ritual ends, another begins.
        </motion.p>
      </div>
      <div className="seeds-slide-row">
        <div className="slide-content-image">
          <motion.img src={productImage} alt="Насіння" {...scaleDown()} />
        </div>
        <div className="seeds-slide-title">
          <motion.p
            className="seeds-slide-title-script seeds-slide-title-script--first"
            {...fadeInUp()}
          >
            A little
          </motion.p>
          <motion.p className="seeds-slide-title-bold" {...fadeInUp(0.1)}>
            light,
          </motion.p>
          <motion.p
            className="seeds-slide-title-script seeds-slide-title-script--second"
            {...fadeInUp(0.2)}
          >
            a little
          </motion.p>
          <motion.p className="seeds-slide-title-bold-italic" {...fadeInUp(0.3)}>
            life...
          </motion.p>
        </div>
      </div>
      <div className="seeds-slide-caption">
        <motion.p className="body-text" {...fadeInUp(0.4)}>
          Every candle leaves something behind — seeds for whatever comes next.
        </motion.p>
      </div>
    </div>
  )
}

export default SeedsSlide
