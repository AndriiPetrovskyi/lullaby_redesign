import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./BuyBar.css";

// Sticky "Buy now" bar for the mobile product page. Only shows in the
// stretch where neither of the page's own button rows is on screen — after
// the top buttons scroll away and before the bottom ones come into view —
// so it never sits on top of a real button or the "You may also like" row.
function BuyBar({ name, price, onBuy, firstCtaSelector, lastCtaSelector }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const first = document.querySelector(firstCtaSelector);
      const last = document.querySelector(lastCtaSelector);
      if (!first || !last) return setVisible(false);
      const firstGone = first.getBoundingClientRect().bottom < 0;
      const lastNotYet = last.getBoundingClientRect().top > window.innerHeight;
      setVisible(firstGone && lastNotYet);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [firstCtaSelector, lastCtaSelector]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="m-buy-bar"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.25, ease: "easeOut" }}>
          <div className="m-buy-bar-info">
            <p className="m-buy-bar-name">
              {name} · <span className="m-buy-bar-price">${price}</span>
            </p>
            <p className="m-buy-bar-note">Free shipping to US &amp; Canada</p>
          </div>
          <button type="button" className="m-buy-bar-button" onClick={onBuy}>
            Buy now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BuyBar;
