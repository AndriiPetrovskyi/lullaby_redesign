import productImage from "../../assets/handmade.jpg";
import "./HomeRow.css";

function HandmadeSlide() {
  return (
    <div className="home-row">
      <div className="home-row-text">
        <p className="home-row-eyebrow">Nothing perfect. Everything personal.</p>
        <h2 className="home-row-title">
          <span className="home-row-title-script">Made by hand</span>
          <span className="home-row-title-bold">made to feel</span>
        </h2>
        <p className="home-row-caption">
          Small imperfections, soft variations, and the touch of the maker make
          every piece unique.
        </p>
      </div>
      <figure className="home-row-media">
        <img
          src={productImage}
          alt="A Lullaby candle being finished by hand"
          width="960"
          height="1280"
          loading="lazy"
          decoding="async"
        />
      </figure>
    </div>
  );
}

export default HandmadeSlide;
