import { Link } from "react-router-dom";
import { photoKey, responsiveImage } from "../utils/images.js";
import "./ProductCard.css";

const LOW_STOCK_THRESHOLD = 3;
const CARD_WIDTHS = [400, 600, 800];
const CARD_SIZES = "(min-width: 768px) 33vw, 100vw";

function getScentTeaser(product) {
  if (product.fragranceNotes?.top) return product.fragranceNotes.top;
  const firstLine = product.scent?.split(/\r?\n/)[0]?.trim();
  return firstLine || undefined;
}

function getHoverImage(product) {
  const mainKey = photoKey(product.image);
  return product.gallery?.find((src) => src && photoKey(src) !== mainKey);
}

function ProductCard({ product }) {
  const scentTeaser = getScentTeaser(product);
  const hoverImage = getHoverImage(product);
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;

  return (
    <Link to={`/products/${product.slug}`} className="product-card">
      <div className="product-card-image">
        <img
          className="product-card-image-primary"
          {...responsiveImage(product.image, CARD_WIDTHS, CARD_SIZES)}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
        {hoverImage && (
          <img
            className="product-card-image-hover"
            {...responsiveImage(hoverImage, CARD_WIDTHS, CARD_SIZES)}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />
        )}
        {isLowStock && (
          <span className="product-card-stock-badge">
            Only {product.stock} left
          </span>
        )}
      </div>
      <p className="product-card-name">{product.name}</p>
      <p className="product-card-scent">{scentTeaser}</p>
      <p className="product-card-price">${product.price}</p>
    </Link>
  );
}

export default ProductCard;
