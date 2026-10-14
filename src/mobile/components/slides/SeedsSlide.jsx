import notesImage from "../../../assets/notes/notes-and-vial.webp";
import "./Slide.css";
import "./SeedsSlide.css";

function SeedsSlide() {
  return (
    <div className="m-slide-content m-seeds-slide">
      <div className="m-seeds-slide-title m-seeds-slide-title--top">
        <p className="m-seeds-slide-title-script">Message</p>
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--light">
          in a
        </p>
      </div>

      <div className="m-slide-content-image">
        <img
          src={notesImage}
          alt="Handwritten notes beside a small corked glass vial"
        />
      </div>

      <div className="m-seeds-slide-title m-seeds-slide-title--bottom">
        <p className="m-seeds-slide-title-bold m-seeds-slide-title-bold--italic">
          Vial
        </p>
      </div>

      <p className="m-seeds-slide-caption">
        Every candle
        <br />
        keeps a little
        <br />
        secret — a note
        <br />
        written by hand,
        <br />
        in ink, just for you.
      </p>
    </div>
  );
}

export default SeedsSlide;
