import { Link } from "react-router-dom";
import ProductCard from "../ProductCard.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import "./BestsellersSlide.css";

function BestsellersSlide() {
  const { products } = useProducts();
  const bestsellers = products.slice(0, 4);

  return (
    <div className="bestsellers-slide">
      <h2 className="h2-heading bestsellers-slide-title">
        Bestsellers of the Month
      </h2>
      <div className="bestsellers-slide-grid">
        {bestsellers.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link to="/products" className="bestsellers-slide-more">
        Show more
      </Link>
    </div>
  );
}

export default BestsellersSlide;
