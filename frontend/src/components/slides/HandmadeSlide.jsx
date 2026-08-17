import { motion } from 'framer-motion'
import productImage from '../../assets/handmade.jpg'
import { fadeInUp, scaleDown } from '../../utils/scrollAnimation.js'
import './Slide.css'
import './HandmadeSlide.css'

function HandmadeSlide() {
  return (
    <div className="slide-content handmade-slide">
      <div className="slide-content-text">
        <motion.p className="body-text" {...fadeInUp()}>
          Nothing perfect. Everything personal.
        </motion.p>
      </div>
      <div className="handmade-slide-visual">
        <div className="slide-content-image">
          <motion.img src={productImage} alt="Handmade" {...scaleDown()} />
        </div>
        <div className="handmade-slide-title">
          <motion.p className="handmade-slide-title-script" {...fadeInUp()}>
            Made by hand
          </motion.p>
          <motion.p className="handmade-slide-title-bold" {...fadeInUp(0.1)}>
            made to feel
          </motion.p>
        </div>
      </div>
      <div className="handmade-slide-caption">
        <motion.p className="body-text" {...fadeInUp(0.2)}>
          Small imperfections, soft variations, and the touch of the maker make
          every piece unique.
        </motion.p>
      </div>
    </div>
  )
}

export default HandmadeSlide
