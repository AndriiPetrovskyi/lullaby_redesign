import "./ProductCard.css";

function ProductCardSkeleton() {
  return (
    <div className="product-card" aria-hidden="true">
      <div className="product-card-skeleton-image" />
      <div className="product-card-skeleton-line product-card-skeleton-line--name" />
      <div className="product-card-skeleton-line product-card-skeleton-line--scent" />
      <div className="product-card-skeleton-line product-card-skeleton-line--price" />
    </div>
  );
}

export default ProductCardSkeleton;
