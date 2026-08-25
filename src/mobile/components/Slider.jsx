import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import './Slider.css'

const pad = (n) => String(n).padStart(2, '0')
const AUTOPLAY_INTERVAL = 5000
const SWIPE_THRESHOLD = 50

function Slider({ slides }) {
  const [index, setIndex] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const total = slides.length

  const goPrev = () => {
    setAutoplay(false)
    setIndex((i) => (i === 0 ? total - 1 : i - 1))
  }

  const goNext = () => {
    setAutoplay(false)
    setIndex((i) => (i === total - 1 ? 0 : i + 1))
  }

  const handlePanEnd = (event, info) => {
    if (info.offset.x <= -SWIPE_THRESHOLD) {
      goNext()
    } else if (info.offset.x >= SWIPE_THRESHOLD) {
      goPrev()
    }
  }

  useEffect(() => {
    if (!autoplay) return

    const id = setInterval(() => {
      setIndex((i) => (i === total - 1 ? 0 : i + 1))
    }, AUTOPLAY_INTERVAL)

    return () => clearInterval(id)
  }, [autoplay, total])

  return (
    <div className="m-slider">
      <div className="m-slider-viewport">
        <motion.div
          className="m-slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
          onPanEnd={handlePanEnd}
        >
          {slides.map((slide, i) => (
            <div className="m-slider-slide" key={i}>
              {slide}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="m-slider-controls">
        <div className="m-slider-counter">
          {pad(index + 1)} / {pad(total)}
        </div>
      </div>
    </div>
  )
}

export default Slider
