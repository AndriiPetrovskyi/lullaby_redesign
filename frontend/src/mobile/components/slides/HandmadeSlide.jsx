import productImage from "../../../assets/slider/1.jpg";
import "./Slide.css";
import "./HandmadeSlide.css";

function HandmadeSlide() {
  return (
    <div className="m-slide-content m-handmade-slide">
      <img className="m-slide-bg-image" src={productImage} alt="Handmade" />

      <p className="m-handmade-slide-tagline">
        Nothing perfect. Everything personal.
      </p>

      <div className="m-handmade-slide-title">
        <p className="m-handmade-slide-title-script">Made by</p>
        <p className="m-handmade-slide-title-bold">hand</p>
        <p className="m-handmade-slide-title-bold2">made to feel</p>
      </div>

      <p className="m-handmade-slide-caption">
        Small imperfections, soft variations, and the touch of the maker make
        every piece unique.
      </p>
    </div>
  );
}

export default HandmadeSlide;
