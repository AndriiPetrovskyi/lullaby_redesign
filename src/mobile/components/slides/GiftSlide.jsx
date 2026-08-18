import productVideo from '../../../assets/video2.MP4'
import './Slide.css'
import './GiftSlide.css'

function GiftSlide() {
  return (
    <div className="m-slide-content m-gift-slide">
      <div className="m-slide-content-image">
        <video src={productVideo} autoPlay loop muted playsInline />
      </div>
      <div className="m-slide-content-text">
        <p className="body-text">The best gifts say what words can't.</p>
      </div>
      <div className="m-slide-content-text">
        <h2 className="h2-heading">A gift before the gift</h2>
      </div>
    </div>
  )
}

export default GiftSlide
