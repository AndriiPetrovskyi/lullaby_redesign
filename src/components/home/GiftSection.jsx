// Home, section 4: the gift. The boxes in the middle, the text under them.
import ImageFrame from "../ImageFrame.jsx";
import MoreLink from "../MoreLink.jsx";
import styles from "./GiftSection.module.css";

function GiftSection() {
  return (
    <section className={styles.section}>
      <ImageFrame
        src="/images/gift-boxes.png"
        alt="Lullaby candles with a message vial in black gift boxes"
        // a square, but at most 60% of the screen height, so the section
        // fits one screen on low laptops
        width="min(550px, 60svh)"
        height="min(550px, 60svh)"
        mobileWidth="100%"
        mobileRatio="1/1"
        sizes="(max-width: 767px) 100vw, 550px"
      />

      <h2 className={styles.title}>
        A gift with everything already <span className={styles.accent}>thought through</span>.
        <br />
        All that&apos;s left is a little of <span className={styles.accent}>you</span>
      </h2>
      <p className={styles.subtitle}>
        A candle in a beautiful black box, a vial with a message and a few words
        of your own. Choose a scent, write what you want to say, and we&apos;ll
        take care of the rest. The gift is ready to meet its person.
      </p>
      <MoreLink href="/products">Choose a gift</MoreLink>
    </section>
  );
}

export default GiftSection;
