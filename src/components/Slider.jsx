import { useEffect, useState } from 'react'
import './Slider.css'

const pad = (n) => String(n).padStart(2, '0')
const AUTOPLAY_INTERVAL = 5000

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

  useEffect(() => {
    if (!autoplay) return

    const id = setInterval(() => {
      setIndex((i) => (i === total - 1 ? 0 : i + 1))
    }, AUTOPLAY_INTERVAL)

    return () => clearInterval(id)
  }, [autoplay, total])

  return (
    <div className="slider">
      <div className="slider-viewport">
        <div
          className="slider-track"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div className="slider-slide" key={i}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="slider-controls">
        <div className="slider-nav">
          <button type="button" className="slider-nav-btn" onClick={goPrev}>
            Prev
          </button>
          <span className="slider-nav-divider">/</span>
          <button type="button" className="slider-nav-btn slider-nav-btn--next" onClick={goNext}>
            Next
          </button>
        </div>
        <div className="slider-counter">
          {pad(index + 1)} / {pad(total)}
        </div>
      </div>
    </div>
  )
}

export default Slider
