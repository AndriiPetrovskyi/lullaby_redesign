import { useState } from "react";
import { useParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import products from "../data/products.js";
import Slider from "../mobile/components/Slider.jsx";
import "./ProductPage.css";

function ProductPage() {
  const { slug } = useParams();
  const isMobile = useIsMobile();
  const product = products.find((p) => String(p.id) === slug);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

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
            <p
              className={
                isDescriptionOpen
                  ? "body-text m-product-page-description"
                  : "body-text m-product-page-description m-product-page-description--collapsed"
              }
            >
              {product.description}
            </p>
            <button
              type="button"
              className="m-product-page-accordion-toggle"
              aria-expanded={isDescriptionOpen}
              onClick={() => setIsDescriptionOpen((open) => !open)}
            >
              {isDescriptionOpen ? "Read less" : "Read more"}
            </button>
          </div>

          {product.video && (
            <video
              className="m-product-page-video"
              src={product.video}
              autoPlay
              loop
              muted
              playsInline
            />
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
