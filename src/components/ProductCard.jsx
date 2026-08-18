import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-card-image">
        <img src={product.image} alt={product.name} />
      </div>
      <p className="product-card-name">{product.name}</p>
      <p className="product-card-price">{product.price} $</p>
    </Link>
  );
}

export default ProductCard;
