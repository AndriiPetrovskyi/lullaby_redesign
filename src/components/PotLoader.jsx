// The loading animation: a Lullaby vessel fills with wax, then a flame lights
// on the wick, and it starts over. SVG moved by CSS (PotLoader.module.css).
// It appears after 0.3 s, so nothing blinks when things load quickly.
//
//   <PotLoader />            64px
//   <PotLoader size={24} />  small, e.g. next to text

import styles from "./PotLoader.module.css";

// The vessel's outline (viewBox 0 0 60 80), traced from a photo of the real one.
const POT_SHAPE =
  "M8 18 H52 C52 25 48.3 29 48.3 34.7 C48.3 41 52.3 45 52.3 50 L52.3 70 Q52.3 76 46 76 H14 Q7.7 76 7.7 70 L7.7 50 C7.7 45 11.7 41 11.7 34.7 C11.7 29 8 25 8 18 Z";

function PotLoader({ size = 64 }) {
  return (
    <div className={styles.loader} role="status" aria-label="Loading">
      <svg width={size} height={(size * 80) / 60} viewBox="0 0 60 80">
        <defs>
          {/* The wax shows only inside the vessel. Several loaders share the
              id, but also the shape, so that's fine. */}
          <clipPath id="lullaby-pot-clip">
            <path d={POT_SHAPE} />
          </clipPath>
        </defs>

        {/* The wax: a wavy band rising from the bottom */}
        <g clipPath="url(#lullaby-pot-clip)">
          <g className={styles.wax}>
            <path
              className={styles.wave}
              d="M0 21 Q7.5 18 15 21 T30 21 T45 21 T60 21 T75 21 T90 21 T105 21 T120 21 V80 H0 Z"
            />
          </g>
        </g>

        <path d={POT_SHAPE} className={styles.pot} />

        {/* The lettering at the bottom, like the logo on the real vessel */}
        <text x="30" y="68" textAnchor="middle" className={styles.logo}>
          LULLABY
        </text>

        <line x1="30" y1="21" x2="30" y2="10" className={styles.wick} />
        <g className={styles.flame}>
          <path d="M30 0 C33 4 34 6 34 8 A4 4 0 0 1 26 8 C26 6 27 4 30 0 Z" className={styles.flameOuter} />
          <path d="M30 4 C31.5 6 32 7 32 8.5 A2 2 0 0 1 28 8.5 C28 7 28.5 6 30 4 Z" className={styles.flameInner} />
        </g>
      </svg>
    </div>
  );
}

export default PotLoader;
