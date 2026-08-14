import productImage from '../../../assets/slider/1.jpg'
import './Slide.css'

function GiftSlide() {
  return (
    <div className="m-slide-content">
      <div className="m-slide-content-text">
        <p className="body-text">The best gifts say what words can't.</p>
      </div>
      <div className="m-slide-content-image">
        <img src={productImage} alt="Подарунок" />
      </div>
      <div className="m-slide-content-text">
        <h2 className="h2-heading">A gift before the gift</h2>
      </div>
    </div>
  )
}

export default GiftSlide
