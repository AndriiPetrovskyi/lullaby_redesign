import notesImage from "../../../assets/notes/notes-and-vial.webp";
import "./Slide.css";
import "./SeedsSlide.css";

function SeedsSlide() {
  return (
    <div className="m-slide-content m-seeds-slide">
      <div className="m-seeds-slide-heading">
        <h2 className="m-seeds-slide-title">
          <span className="m-seeds-slide-title-script">Message in a</span>
          <span className="m-seeds-slide-title-bold">Vial</span>
        </h2>
        <p className="m-seeds-slide-caption">
          Every candle keeps a little secret — a note written by hand, in ink,
          just for you.
        </p>
      </div>

      <div className="m-slide-content-image">
        <img
          src={notesImage}
          alt="Handwritten notes beside a small corked glass vial"
        />
      </div>
    </div>
  );
}

export default SeedsSlide;
