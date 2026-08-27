import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard.jsx";
import { useProducts } from "../hooks/useProducts.js";
import { riseUp } from "../utils/scrollAnimation.js";
import "./ProductsPage.css";

function ProductsPage() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <main>
        <p className="body-text">Завантаження товарів…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <p className="body-text">Не вдалося завантажити товари.</p>
      </main>
    );
  }

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
