import productImage from '../../assets/slider/3.png'
import './Slide.css'
import './SeedsSlide.css'

function SeedsSlide() {
  return (
    <div className="slide-content seeds-slide">
      <div className="slide-content-text">
        <p className="body-text">When one ritual ends, another begins.</p>
      </div>
      <div className="seeds-slide-row">
        <div className="slide-content-image">
          <img src={productImage} alt="Насіння" />
        </div>
        <div className="seeds-slide-title">
          <p className="seeds-slide-title-script seeds-slide-title-script--first">A little</p>
          <p className="seeds-slide-title-bold">light,</p>
          <p className="seeds-slide-title-script seeds-slide-title-script--second">a little</p>
          <p className="seeds-slide-title-bold-italic">life...</p>
        </div>
      </div>
      <div className="seeds-slide-caption">
        <p className="body-text">
          Every candle leaves something behind — seeds for whatever comes next.
        </p>
      </div>
    </div>
  )
}

export default SeedsSlide
