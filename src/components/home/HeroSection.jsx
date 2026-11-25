// Home, section 1 (hero): the first screen, text and a photo of the workshop.
import ImageFrame from "../ImageFrame.jsx";
import styles from "./HeroSection.module.css";

function HeroSection() {
  return (
    <section className={styles.section}>
      <div className={styles.text}>
        <h1 className={styles.title}>
          At first, it&apos;s just <span className={styles.accent}>plaster</span>
        </h1>
        {/* Hand line breaks keep the text on exactly three lines */}
        <p className={styles.subtitle}>
          Then come hands, sanding, wax and scent.
          <br />
          And in the end, something you want to give.
          <br />
          Or keep for yourself.
        </p>
      </div>

      {/* The photo takes the rest of the block under the text */}
      <div className={styles.image}>
        <ImageFrame
          src="/images/hero-workshop.jpg"
          alt="Lullaby gypsum vessels on a table in the workshop"
          height="250px"
          y={85}
          priority
        />
      </div>
    </section>
  );
}

export default HeroSection;
