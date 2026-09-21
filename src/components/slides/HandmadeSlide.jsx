import { motion } from 'framer-motion'
import productImage from '../../assets/handmade.jpg'
import { fadeInUp, scaleDown } from '../../utils/scrollAnimation.js'
import './HandmadeSlide.css'

function HandmadeSlide() {
  return (
    <div className="handmade-slide">
      <div className="handmade-slide-image">
        <motion.img src={productImage} alt="Handmade" {...scaleDown()} />
      </div>
      <div className="handmade-slide-overlay">
        <motion.p className="body-text handmade-slide-intro" {...fadeInUp()}>
          Nothing perfect. Everything personal.
        </motion.p>
        <div className="handmade-slide-title">
          <motion.p className="handmade-slide-title-script" {...fadeInUp()}>
            Made by hand
          </motion.p>
          <motion.p className="handmade-slide-title-bold" {...fadeInUp(0.1)}>
            made to feel
          </motion.p>
        </div>
        <motion.p className="body-text handmade-slide-caption" {...fadeInUp(0.2)}>
          Small imperfections, soft variations, and the touch of the maker make
          every piece unique.
        </motion.p>
      </div>
    </div>
  )
}

export default HandmadeSlide
