import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useProduct } from "../hooks/useProducts.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import MutableVideo from "../components/MutableVideo.jsx";
import Modal from "../components/Modal.jsx";
import Slider from "../mobile/components/Slider.jsx";
import vesselImage from "../assets/fl1.PNG";
import jarProcessVideo from "../assets/process.mp4";
import boxProcessVideo from "../assets/video2.MP4";
import "./ProductPage.css";

const CONTACT_EMAIL = "hello@lullaby.com";
const INSTAGRAM_HANDLE = "@lullaby.candles";

const PRODUCT_INFO_SECTIONS = [
  {
    title: "Shipping & Delivery",
    content:
      "Orders ship within 2–3 business days. Delivery typically takes 5–10 business days depending on location.",
  },
  {
    title: "Returns & Damaged Items",
    content:
      "We accept returns within 14 days of delivery. If your item arrives damaged, contact us within 48 hours for a replacement.",
  },
];

function ProductPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const { product, isLoading, error } = useProduct(slug);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [openInfoSections, setOpenInfoSections] = useState(() => new Set());
  const [isDirectOrderModalOpen, setIsDirectOrderModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  const toggleInfoSection = (index) => {
    setOpenInfoSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <main>
        <LoadingScreen />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main>
        <h1 className="h1-heading">Товар не знайдено</h1>
      </main>
    );
  }

  if (isMobile) {
    return (
      <main className="m-product-page">
        <Slider
          slides={product.gallery.map((src, i) => (
            <img key={i} src={src} alt={`${product.name} ${i + 1}`} />
          ))}
        />
        <div className="m-product-page-info">
          <p className="m-product-page-name">{product.name}</p>
          <p className="m-product-page-price">{product.price} $</p>
          <div className="m-product-page-cta-row">
            <a
              href={product.etsyUrl}
              target="_blank"
              rel="noreferrer"
              className="m-product-page-buy-etsy">
              Buy on Etsy
            </a>
            <button
              type="button"
              className="m-product-page-direct-order"
              onClick={() => setIsDirectOrderModalOpen(true)}>
              Direct Order
            </button>
          </div>

          {product.fragranceNotes && (
            <div className="m-product-page-notes">
              <p className="m-product-page-notes-title">Fragrance Notes</p>
              <p className="m-product-page-notes-row">
                <span>Top:</span> {product.fragranceNotes.top}
              </p>
              <p className="m-product-page-notes-row">
                <span>Heart:</span> {product.fragranceNotes.heart}
              </p>
              <p className="m-product-page-notes-row">
                <span>Base:</span> {product.fragranceNotes.base}
              </p>
            </div>
          )}

          <div className="m-product-page-accordion">
            <motion.div
              className={
                isDescriptionOpen
                  ? "m-product-page-description-wrap"
                  : "m-product-page-description-wrap m-product-page-description-wrap--collapsed"
              }
              initial={false}
              animate={{ height: isDescriptionOpen ? "auto" : 60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <p className="body-text m-product-page-description">
                {product.description}
              </p>
            </motion.div>
            <button
              type="button"
              className="m-product-page-accordion-toggle"
              aria-expanded={isDescriptionOpen}
              onClick={() => setIsDescriptionOpen((open) => !open)}>
              {isDescriptionOpen ? "Read less" : "Read more"}
            </button>
          </div>

          <div className="m-product-page-faq">
            {PRODUCT_INFO_SECTIONS.map((section, i) => {
              const isOpen = openInfoSections.has(i);
              return (
                <div className="m-product-page-faq-item" key={section.title}>
                  <button
                    type="button"
                    className="m-product-page-faq-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleInfoSection(i)}>
                    {section.title}
                    <motion.span
                      className="m-product-page-faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="m-product-page-faq-content-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <p className="body-text m-product-page-faq-content">
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="m-product-page-video-section">
            <p className="m-product-page-video-title">
              Crafted, not mass-produced: art in every detail.
            </p>
            <div className="m-product-page-video-frame">
              <MutableVideo
                className="m-product-page-video"
                src={jarProcessVideo}></MutableVideo>
            </div>
            <p className="m-product-page-video-caption">
              Poured by hand, one candle at a time — every pour a little
              different from the last.
            </p>
          </div>

          <div className="m-product-page-vessel-section">
            <p className="m-product-page-vessel-title">
              Don't throw the vessel away.
              <br />
              Plant a flower in it.
            </p>
            <img
              className="m-product-page-vessel-image"
              src={vesselImage}
              alt="Ваза зі свічки з квіткою"
            />
            <p className="m-product-page-vessel-caption">
              Burn the candle, keep the vessel, and grow something new — a small
              ritual that keeps on giving.
            </p>
          </div>

          <div className="m-product-page-gift-section">
            <p className="m-product-page-gift-title">
              The Perfect Frame. A Ready-to-Give Gift.
            </p>
            <div className="m-product-page-video-frame">
              <MutableVideo
                className="m-product-page-video"
                src={boxProcessVideo}></MutableVideo>
            </div>
            <p className="m-product-page-gift-caption">
              Ready to gift, straight out of the box — no extra wrapping, no
              last-minute run to the store.
            </p>
          </div>

          <div className="m-product-page-closing-section">
            <p className="body-text m-product-page-closing-text">
              From the first touch of raw material to the sprout that grows from
              the seeds.
              <span className="m-product-page-closing-text-emphasis">
                We've created not just an object, but an emotion—perfectly
                packaged and ready to be your ultimate gift.
              </span>
            </p>
            <div className="m-product-page-cta-row">
              <a
                href={product.etsyUrl}
                target="_blank"
                rel="noreferrer"
                className="m-product-page-buy-etsy">
                Buy on Etsy
              </a>
              <button
                type="button"
                className="m-product-page-direct-order"
                onClick={() => setIsDirectOrderModalOpen(true)}>
                Direct Order
              </button>
            </div>
          </div>
        </div>

        <Modal
          isOpen={isDirectOrderModalOpen}
          onClose={() => setIsDirectOrderModalOpen(false)}>
          <p className="modal-title">Prefer a direct order?</p>
          <p className="body-text modal-text">
            Secure your order directly through us. Reach out via Instagram or
            Email, and we will quickly arrange your payment through PayPal or
            Payoneer. We usually reply within a few hours to finalize your
            handmade order.
          </p>
          <div className="modal-contacts">
            <a href={`mailto:${CONTACT_EMAIL}`} className="modal-contact-link">
              {CONTACT_EMAIL}
            </a>
            <span className="modal-contact-link modal-contact-link--static">
              {INSTAGRAM_HANDLE}
            </span>
          </div>
        </Modal>
      </main>
    );
  }

  const galleryImages = [product.image, ...(product.gallery ?? [])].filter(
    (src, i, arr) => src && arr.indexOf(src) === i,
  );

  return (
    <main className="d-product-page">
      <div className="d-product-page-top">
          <div className="d-product-page-gallery">
          <div className="d-product-page-gallery-stage">
            <motion.img
              key={activeImage}
              className="d-product-page-gallery-main"
              src={galleryImages[activeImage] ?? galleryImages[0]}
              alt={product.name}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="d-product-page-gallery-arrow d-product-page-gallery-arrow--prev"
                  onClick={() =>
                    setActiveImage((i) =>
                      i === 0 ? galleryImages.length - 1 : i - 1,
                    )
                  }
                  aria-label="Попереднє фото">
                  ‹
                </button>
                <button
                  type="button"
                  className="d-product-page-gallery-arrow d-product-page-gallery-arrow--next"
                  onClick={() =>
                    setActiveImage((i) =>
                      i === galleryImages.length - 1 ? 0 : i + 1,
                    )
                  }
                  aria-label="Наступне фото">
                  ›
                </button>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="d-product-page-thumbs">
              {galleryImages.map((src, i) => (
                <button
                  type="button"
                  key={i}
                  className={
                    i === activeImage
                      ? "d-product-page-thumb d-product-page-thumb--active"
                      : "d-product-page-thumb"
                  }
                  onClick={() => setActiveImage(i)}
                  aria-label={`${product.name} — фото ${i + 1}`}>
                  <img src={src} alt={`${product.name} ${i + 1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="d-product-page-info">
          <h1 className="d-product-page-name">{product.name}</h1>
          <p className="d-product-page-price">{product.price} $</p>

          <div className="d-product-page-cta-row">
            <a
              href={product.etsyUrl}
              target="_blank"
              rel="noreferrer"
              className="d-product-page-buy-etsy">
              Buy on Etsy
            </a>
            <button
              type="button"
              className="d-product-page-direct-order"
              onClick={() => setIsDirectOrderModalOpen(true)}>
              Direct Order
            </button>
          </div>

          {product.fragranceNotes && (
            <div className="d-product-page-notes">
              <p className="d-product-page-notes-title">Fragrance Notes</p>
              <p className="d-product-page-notes-row">
                <span>Top:</span> {product.fragranceNotes.top}
              </p>
              <p className="d-product-page-notes-row">
                <span>Heart:</span> {product.fragranceNotes.heart}
              </p>
              <p className="d-product-page-notes-row">
                <span>Base:</span> {product.fragranceNotes.base}
              </p>
            </div>
          )}

          <div className="d-product-page-accordion">
            <motion.div
              className={
                isDescriptionOpen
                  ? "d-product-page-description-wrap"
                  : "d-product-page-description-wrap d-product-page-description-wrap--collapsed"
              }
              initial={false}
              animate={{ height: isDescriptionOpen ? "auto" : 108 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <p className="body-text d-product-page-description">
                {product.description}
              </p>
            </motion.div>
            <button
              type="button"
              className="d-product-page-accordion-toggle"
              aria-expanded={isDescriptionOpen}
              onClick={() => setIsDescriptionOpen((open) => !open)}>
              {isDescriptionOpen ? "Read less" : "Read more"}
            </button>
          </div>

          <div className="d-product-page-faq">
            {PRODUCT_INFO_SECTIONS.map((section, i) => {
              const isOpen = openInfoSections.has(i);
              return (
                <div className="d-product-page-faq-item" key={section.title}>
                  <button
                    type="button"
                    className="d-product-page-faq-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleInfoSection(i)}>
                    {section.title}
                    <motion.span
                      className="d-product-page-faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="d-product-page-faq-content-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <p className="body-text d-product-page-faq-content">
                          {section.content}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="d-product-page-story">
        <div className="d-product-page-story-media">
          <MutableVideo
            className="d-product-page-video"
            src={jarProcessVideo}></MutableVideo>
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            Crafted, not mass-produced: art in every detail.
          </p>
          <p className="d-product-page-story-caption">
            Poured by hand, one candle at a time — every pour a little different
            from the last.
          </p>
        </div>
      </section>

      <section className="d-product-page-story d-product-page-story--reverse">
        <img
          className="d-product-page-story-media d-product-page-vessel-image"
          src={vesselImage}
          alt="Ваза зі свічки з квіткою"
        />
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            Don&apos;t throw the vessel away. Plant a flower in it.
          </p>
          <p className="d-product-page-story-caption">
            Burn the candle, keep the vessel, and grow something new — a small
            ritual that keeps on giving.
          </p>
        </div>
      </section>

      <section className="d-product-page-story">
        <div className="d-product-page-story-media">
          <MutableVideo
            className="d-product-page-video"
            src={boxProcessVideo}></MutableVideo>
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            The Perfect Frame. A Ready-to-Give Gift.
          </p>
          <p className="d-product-page-story-caption">
            Ready to gift, straight out of the box — no extra wrapping, no
            last-minute run to the store.
          </p>
        </div>
      </section>

      <div className="d-product-page-inner">
        <section className="d-product-page-closing-section">
        <p className="d-product-page-closing-text">
          From the first touch of raw material to the sprout that grows from the
          seeds.
          <span className="d-product-page-closing-text-emphasis">
            We&apos;ve created not just an object, but an emotion—perfectly
            packaged and ready to be your ultimate gift.
          </span>
        </p>
        <div className="d-product-page-cta-row d-product-page-cta-row--closing">
          <a
            href={product.etsyUrl}
            target="_blank"
            rel="noreferrer"
            className="d-product-page-buy-etsy">
            Buy on Etsy
          </a>
          <button
            type="button"
            className="d-product-page-direct-order"
            onClick={() => setIsDirectOrderModalOpen(true)}>
            Direct Order
          </button>
        </div>
        </section>
      </div>

      <Modal
        isOpen={isDirectOrderModalOpen}
        onClose={() => setIsDirectOrderModalOpen(false)}>
        <p className="modal-title">Prefer a direct order?</p>
        <p className="body-text modal-text">
          Secure your order directly through us. Reach out via Instagram or
          Email, and we will quickly arrange your payment through PayPal or
          Payoneer. We usually reply within a few hours to finalize your handmade
          order.
        </p>
        <div className="modal-contacts">
          <a href={`mailto:${CONTACT_EMAIL}`} className="modal-contact-link">
            {CONTACT_EMAIL}
          </a>
          <span className="modal-contact-link modal-contact-link--static">
            {INSTAGRAM_HANDLE}
          </span>
        </div>
      </Modal>
    </main>
  );
}

export default ProductPage;
