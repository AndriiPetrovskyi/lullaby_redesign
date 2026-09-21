import { motion } from 'framer-motion'
import productImage from '../../assets/slider/3.png'
import { fadeInUp, scaleDown } from '../../utils/scrollAnimation.js'
import './SeedsSlide.css'

function SeedsSlide() {
  return (
    <div className="seeds-slide">
      <div className="seeds-slide-image">
        <motion.img src={productImage} alt="Seeds" {...scaleDown()} />
      </div>
      <div className="seeds-slide-text">
        <motion.p className="body-text seeds-slide-intro" {...fadeInUp()}>
          When one ritual ends, another begins.
        </motion.p>
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
        <motion.p className="body-text seeds-slide-caption" {...fadeInUp(0.4)}>
          Every candle leaves something behind — seeds for whatever comes next.
        </motion.p>
      </div>
    </div>
  )
}

export default SeedsSlide
