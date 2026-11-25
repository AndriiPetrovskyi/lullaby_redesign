// Home, section 5: the vessel's second life. The mirror of section 3: a
// large photo on the left, text on the right.
import ImageFrame from "../ImageFrame.jsx";
import styles from "./AboutSection.module.css";

function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <ImageFrame
          src="/images/pot-plant.jpg"
          alt="A blue Lullaby gypsum vessel with a living plant"
          width="276px"
          height="447px"
          mobileWidth="100%"
          mobileRatio="4/5"
          sizes="(max-width: 767px) 100vw, 276px"
          // the vessel stands on the left of the photo, so keep its left part
          x={0}
        />

        <div className={styles.text}>
          <h2 className={styles.title}>
            A second <span className={styles.accent}>life</span> for your vessel
          </h2>
          <p className={styles.subtitle}>
            When the wax burns down, the gypsum vessel stays with you. Plant a
            favorite plant or seeds in it, keep brushes and pens in it, or the
            little things that never have a place. It&apos;s up to you; we just
            left room for a new idea.
          </p>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
