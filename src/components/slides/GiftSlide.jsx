import productImage from "../../assets/gift-boxes.jpg";
import "./HomeRow.css";

function GiftSlide() {
  return (
    <div className="home-row home-row--media-first">
      <figure className="home-row-media">
        <img
          src={productImage}
          alt="Two Lullaby candles in open black keepsake boxes, each with a corked note vial"
          width="1600"
          height="1600"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="home-row-text">
        <p className="home-row-eyebrow">The best gifts say what words can't.</p>
        <h2 className="home-row-title">
          <span className="home-row-title-bold">The first impression</span>
          <span className="home-row-title-script">is a part of</span>
          <span className="home-row-title-bold">the gift</span>
        </h2>
        <p className="home-row-caption">
          Each candle arrives in a handcrafted keepsake box, created with the
          same care as what's inside.
        </p>
      </div>
    </div>
  );
}

export default GiftSlide;
