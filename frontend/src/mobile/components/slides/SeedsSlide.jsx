import productImage from '../../../assets/slider/3.png'
import './Slide.css'

function SeedsSlide() {
  return (
    <div className="m-slide-content">
      <div className="m-slide-content-text">
        <p className="body-text">When one ritual ends, another begins.</p>
      </div>
      <div className="m-slide-content-image">
        <img src={productImage} alt="Насіння" />
      </div>
      <div className="m-slide-content-text">
        <h2 className="h2-heading">A little light, a little life...</h2>
      </div>
    </div>
  )
}

export default SeedsSlide
