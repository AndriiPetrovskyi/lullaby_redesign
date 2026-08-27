import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProductCard from "../ProductCard.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { fadeInUp, riseUp } from "../../utils/scrollAnimation.js";
import "./Slide.css";
import "./BestsellersSlide.css";

function BestsellersSlide() {
  const { products } = useProducts();
  const bestsellers = products.slice(0, 4);

  return (
    <div className="slide-content bestsellers-slide">
      <motion.p className="h2-heading bestsellers-slide-title" {...fadeInUp()}>
        Bestsellers of the Month
      </motion.p>
      <div className="bestsellers-slide-grid">
        {bestsellers.map((product, i) => (
          <motion.div key={product.id} {...riseUp(i * 0.1)}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
      <motion.div {...fadeInUp(0.3)}>
        <Link to="/products" className="bestsellers-slide-more">
          Show more
        </Link>
      </motion.div>
    </div>
  );
}

export default BestsellersSlide;
