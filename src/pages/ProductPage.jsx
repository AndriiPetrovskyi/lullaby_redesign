import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import products from "../data/products.js";
import MutableVideo from "../components/MutableVideo.jsx";
import Modal from "../components/Modal.jsx";
import Slider from "../mobile/components/Slider.jsx";
import vesselImage from "../assets/fl1.PNG";
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
  const product = products.find((p) => String(p.id) === slug);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [openInfoSections, setOpenInfoSections] = useState(() => new Set());
  const [isDirectOrderModalOpen, setIsDirectOrderModalOpen] = useState(false);

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

  if (!product) {
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
                <span>Top</span> {product.fragranceNotes.top}
              </p>
              <p className="m-product-page-notes-row">
                <span>Heart</span> {product.fragranceNotes.heart}
              </p>
              <p className="m-product-page-notes-row">
                <span>Base</span> {product.fragranceNotes.base}
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

          <p className="m-product-page-video-title">
            Crafted, not mass-produced: art in every detail.
          </p>
          {product.video && (
            <div className="m-product-page-video-frame">
              <MutableVideo
                className="m-product-page-video"
                src={product.video}></MutableVideo>
            </div>
          )}

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

  return (
    <main>
      <h1 className="h1-heading">Товар {slug}</h1>
    </main>
  );
}

export default ProductPage;
