import productImage from '../../assets/slider/1.jpg'
import './Slide.css'
import './GiftSlide.css'

function GiftSlide() {
  return (
    <div className="slide-content gift-slide">
      <div className="gift-slide-row">
        <div className="gift-slide-title">
          <p className="body-text gift-slide-tagline">The best gifts say what words can't.</p>
          <p className="gift-slide-title-bold">A gift</p>
          <p className="gift-slide-title-script">before</p>
          <p className="gift-slide-title-bold gift-slide-title-bold--second">the gift</p>
        </div>
        <div className="slide-content-image">
          <img src={productImage} alt="Подарунок" />
        </div>
      </div>
      <div className="gift-slide-caption">
        <p className="body-text">
          Each candle arrives in a handcrafted keepsake box, created with the
          same care as what's inside.
        </p>
      </div>
    </div>
  )
}

export default GiftSlide
