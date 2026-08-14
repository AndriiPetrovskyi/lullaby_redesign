import productImage from '../../assets/slider/1.jpg'
import './Slide.css'
import './HandmadeSlide.css'

function HandmadeSlide() {
  return (
    <div className="slide-content handmade-slide">
      <div className="slide-content-text">
        <p className="body-text">Nothing perfect. Everything personal.</p>
      </div>
      <div className="handmade-slide-visual">
        <div className="slide-content-image">
          <img src={productImage} alt="Handmade" />
        </div>
        <div className="handmade-slide-title">
          <p className="handmade-slide-title-script">Made by hand</p>
          <p className="handmade-slide-title-bold">made to feel</p>
        </div>
      </div>
      <div className="handmade-slide-caption">
        <p className="body-text">
          Small imperfections, soft variations, and the touch of the maker make
          every piece unique.
        </p>
      </div>
    </div>
  )
}

export default HandmadeSlide
