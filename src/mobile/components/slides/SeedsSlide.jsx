import productImage from '../../../assets/slider/3.png'
import './Slide.css'
import './SeedsSlide.css'

function SeedsSlide() {
  return (
    <div className="m-slide-content m-seeds-slide">
      <p className="m-seeds-slide-tagline">When one ritual ends, another begins.</p>

      <div className="m-seeds-slide-title m-seeds-slide-title--top">
        <p className="m-seeds-slide-title-script">A little</p>
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--light">light,</p>
      </div>

      <div className="m-slide-content-image">
        <img src={productImage} alt="Насіння" />
      </div>

      <div className="m-seeds-slide-title m-seeds-slide-title--bottom">
        <p className="m-seeds-slide-title-script m-seeds-slide-title-script--bottom">a little</p>
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--italic">life...</p>
      </div>

      <p className="m-seeds-slide-caption">
        Every candle
        <br />
        leaves something
        <br />
        behind — seeds
        <br />
        for whatever
        <br />
        comes next.
      </p>
    </div>
  )
}

export default SeedsSlide
