import { Link } from "react-router-dom";
import "./ProductCard.css";

const LOW_STOCK_THRESHOLD = 3;

function getScentTeaser(product) {
  if (product.fragranceNotes?.top) return product.fragranceNotes.top;
  const firstLine = product.scent?.split(/\r?\n/)[0]?.trim();
  return firstLine || undefined;
}

// The same photo sometimes gets uploaded twice — once as the main image,
// once into the gallery — under the same filename but a different folder
// (".../photo.jpg" vs ".../gallery/photo.jpg"). Comparing full URLs treats
// those as "different", so the hover swap silently lands on a byte-identical
// copy of the main photo. Compare filenames instead to actually skip it.
function getFileName(url) {
  return url?.split("/").pop();
}

function getHoverImage(product) {
  const mainFileName = getFileName(product.image);
  return product.gallery?.find(
    (src) => src && getFileName(src) !== mainFileName,
  );
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
          src={product.image}
          alt={product.name}
        />
        {hoverImage && (
          <img
            className="product-card-image-hover"
            src={hoverImage}
            alt=""
            aria-hidden="true"
          />
        )}
        <span
          className="product-card-seed-badge"
          aria-hidden="true"
          title="A packet of seeds is hidden inside">
          🌱
        </span>
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
