import productImage from "../../../assets/fl3.jpeg";
import "./Slide.css";
import "./SeedsSlide.css";

function SeedsSlide() {
  return (
    <div className="m-slide-content m-seeds-slide">
      <div className="m-seeds-slide-title m-seeds-slide-title--top">
        <p className="m-seeds-slide-title-script">A little</p>
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--light">
          light,
        </p>
      </div>

      <div className="m-slide-content-image">
        <img
          src={productImage}
          alt="A Lullaby candle vessel given a second life as a planter"
        />
      </div>

      <div className="m-seeds-slide-title m-seeds-slide-title--bottom">
        <p className="m-seeds-slide-title-script m-seeds-slide-title-script--bottom">
          a little
        </p>
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--italic">
          magic...
        </p>
      </div>

      <p className="m-seeds-slide-caption">
        Every candle
        <br />
        keeps a little
        <br />
        secret — a
        <br />
        handwritten wish
        <br />
        or fortune.
      </p>
    </div>
  );
}

export default SeedsSlide;
