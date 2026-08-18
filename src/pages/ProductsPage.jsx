import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard.jsx";
import products from "../data/products.js";
import { riseUp } from "../utils/scrollAnimation.js";
import "./ProductsPage.css";

function ProductsPage() {
  return (
    <main>
      <div className="products-grid">
        {products.map((product) => (
          <motion.div key={product.id} {...riseUp()}>
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </main>
  );
}

export default ProductsPage;
