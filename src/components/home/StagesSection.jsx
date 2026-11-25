// Home, section 2: how a vessel is made. Text, a row of photos, a link to
// the workshop page.
import ImageFrame from "../ImageFrame.jsx";
import MoreLink from "../MoreLink.jsx";
import styles from "./StagesSection.module.css";

// width, height: the frame; offset: moved down, so the photos sit at
// different heights; x, y, scale: which part of the photo shows (see
// ImageFrame). In the order of the work: demold, sand, paint, details.
const photos = [
  { src: "/images/stage-demold.jpg", alt: "Taking a gypsum vessel out of its mold", width: 166, height: 240, offset: 48, x: 75, y: 55, scale: 1.4 },
  { src: "/images/stage-sanding.jpg", alt: "Sanding a gypsum vessel", width: 148, height: 302, offset: 0, x: 52, y: 55, scale: 1 },
  { src: "/images/stage-painting.jpg", alt: "Painting a vessel with a brush", width: 126, height: 128, offset: 100, x: 40, y: 45, scale: 1 },
  { src: "/images/stage-details.jpg", alt: "Touching up the Lullaby lettering with a fine brush", width: 212, height: 260, offset: 28, x: 60, y: 55, scale: 1 },
];

function StagesSection() {
  return (
    <section className={styles.section}>
      <div className={styles.text}>
        <h2 className={styles.title}>
          Between plaster and a <span className={styles.accent}>gift</span>
        </h2>
        <p className={styles.subtitle}>
          We make every vessel by hand: we mix the plaster, pour it into molds,
          sand it, paint it and trace the letters of the logo. From the first mix
          to the last brushstroke, it&apos;s all handmade.
        </p>
      </div>

      <div className={styles.gallery}>
        {photos.map((photo) => (
          <div
            key={photo.src}
            className={styles.photo}
            style={{ marginTop: `calc(${photo.offset}px * var(--photo-scale))` }}>
            <ImageFrame
              src={photo.src}
              alt={photo.alt}
              width={`calc(${photo.width}px * var(--photo-scale))`}
              height={`calc(${photo.height}px * var(--photo-scale))`}
              x={photo.x}
              y={photo.y}
              scale={photo.scale}
              sizes="(max-width: 767px) 50vw, 220px"
            />
          </div>
        ))}
      </div>

      <MoreLink href="/about" className={styles.more}>
        Step into the workshop
      </MoreLink>
    </section>
  );
}

export default StagesSection;
