import { Link } from "react-router-dom";
import products from "../../../data/products.js";
import "./Slide.css";
import "./BestsellersSlide.css";

function BestsellersSlide() {
  const bestsellers = products.slice(0, 2);

  return (
    <div className="m-slide-content m-bestsellers-slide">
      <div className="m-bestsellers-slide-title">
        <p className="m-bestsellers-slide-title-script">Monthly</p>
        <p className="m-bestsellers-slide-title-bold">Bestsellers</p>
      </div>
      <div className="m-bestsellers-slide-grid">
        {bestsellers.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.id}`}
            className="m-bestsellers-slide-item">
            <img src={product.image} alt={product.name} />
            <p className="m-bestsellers-slide-item-name">{product.name}</p>
          </Link>
        ))}
      </div>
      <Link to="/products" className="m-bestsellers-slide-more">
        Show more
      </Link>
    </div>
  );
}

export default BestsellersSlide;
