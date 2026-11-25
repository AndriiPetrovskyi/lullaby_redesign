// Home, section 3: text on the left, a large photo on the right.
import ImageFrame from "../ImageFrame.jsx";
import styles from "./FeatureSection.module.css";

function FeatureSection() {
  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <div className={styles.text}>
          <h2 className={styles.title}>
            The candle will burn down someday.
            <br />
            The words will <span className={styles.accent}>stay</span>
          </h2>
          <p className={styles.subtitle}>
            Inside the box is a tiny vial with a personal message. Send us a few
            lines, an inside joke or the words you&apos;ve long wanted to say,
            and we&apos;ll write them out by hand and tuck them into the gift.
            That&apos;s the detail that makes it personal.
          </p>
        </div>

        <ImageFrame
          src="/images/note-vial.jpg"
          alt="Handwritten notes and a glass vial with a cork"
          width="276px"
          height="447px"
          mobileWidth="100%"
          mobileRatio="4/5"
          sizes="(max-width: 767px) 100vw, 276px"
        />
      </div>
    </section>
  );
}

export default FeatureSection;
