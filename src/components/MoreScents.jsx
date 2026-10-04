import { useProducts } from "../hooks/useProducts.js";
import ProductCard from "./ProductCard.jsx";
import "./MoreScents.css";

// Bottom-of-page cross-sell: visitors from ads land on one product and had
// no obvious way on to the rest of the range. On phones it's a swipeable
// row sized so the next card peeks in — that's what signals "swipe me".
function MoreScents({ currentSlug }) {
  const { products } = useProducts();
  const others = products.filter((product) => product.slug !== currentSlug);

  if (others.length === 0) return null;

  return (
    <section className="more-scents" aria-labelledby="more-scents-title">
      <h2 id="more-scents-title" className="more-scents-title">
        You may also like
      </h2>
      <ul className="more-scents-row">
        {others.map((product) => (
          <li key={product.id} className="more-scents-item">
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default MoreScents;
