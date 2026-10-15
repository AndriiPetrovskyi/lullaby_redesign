import notesImage from "../../assets/notes/notes-and-vial.webp";
import "./HomeRow.css";

function SeedsSlide() {
  return (
    <div className="home-row home-row--media-last">
      <figure className="home-row-media">
        <img
          src={notesImage}
          alt="Handwritten notes beside a small corked glass vial"
          width="1280"
          height="1280"
          loading="lazy"
          decoding="async"
        />
      </figure>
      <div className="home-row-text">
        <p className="home-row-eyebrow">Every candle keeps a little secret.</p>
        <h2 className="home-row-title">
          <span className="home-row-title-script">Message</span>
          <span className="home-row-title-bold">in a Vial</span>
        </h2>
        <p className="home-row-caption">
          Tucked beside every candle is a tiny corked vial with a note written
          by hand, in ink, one at a time — a small thought to keep you company,
          like <em>&ldquo;The world won&apos;t stop spinning if you take a
          rest.&rdquo;</em> No two are quite the same.
        </p>
      </div>
    </div>
  );
}

export default SeedsSlide;
