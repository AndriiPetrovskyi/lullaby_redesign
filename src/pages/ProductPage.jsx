import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import products from "../data/products.js";
import MutableVideo from "../components/MutableVideo.jsx";
import Slider from "../mobile/components/Slider.jsx";
import "./ProductPage.css";

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
          <button type="button" className="m-product-page-add-to-cart">
            Add to cart · {product.price} $
          </button>

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
              className="m-product-page-description-wrap"
              initial={false}
              animate={{ height: isDescriptionOpen ? "auto" : 60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
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
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
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
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
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

          {product.video && (
            <MutableVideo className="m-product-page-video" src={product.video} />
          )}
        </div>
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
