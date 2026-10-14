import productImage from "../../assets/slider/3.webp";
import "./HomeRow.css";

function SeedsSlide() {
  return (
    <div className="home-row home-row--media-first">
      <figure className="home-row-media">
        <img
          src={productImage}
          alt="A Lullaby candle vessel given a second life as a planter"
          width="1280"
          height="800"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="home-row-text">
        <p className="home-row-eyebrow">When one ritual ends, another begins.</p>
        <h2 className="home-row-title">
          <span className="home-row-title-script">A little</span>
          <span className="home-row-title-bold">light,</span>
          <span className="home-row-title-script">a little</span>
          <span className="home-row-title-bold">magic...</span>
        </h2>
        <p className="home-row-caption">
          Every candle keeps a little secret — a handwritten wish or fortune,
          waiting just for you.
        </p>
      </div>
    </div>
  );
}

export default SeedsSlide;
