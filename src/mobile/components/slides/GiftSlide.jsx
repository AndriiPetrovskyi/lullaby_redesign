import productVideo from "../../../assets/video2.MP4";
import MutableVideo from "../../../components/MutableVideo.jsx";
import "./Slide.css";
import "./GiftSlide.css";

function GiftSlide() {
  return (
    <div className="m-slide-content m-gift-slide">
      <div className="m-slide-content-image">
        <MutableVideo src={productVideo} />
      </div>
      <div className="m-slide-content-text">
        <p className="body-text m-gift-slide-tagline">
          The best gifts say what words can't.
        </p>
      </div>
      <div className="m-gift-slide-title">
        <p className="m-gift-slide-title-bold">A gift</p>
        <p className="m-gift-slide-title-script">before</p>
        <p className="m-gift-slide-title-bold-bottom">the gift</p>
      </div>
      <div className="m-slide-content-text">
        <p className="body-text m-gift-slide-caption">
          Each candle arrives in a handcrafted keepsake box, created with the
          same care as what's inside.
        </p>
      </div>
    </div>
  );
}

export default GiftSlide;
