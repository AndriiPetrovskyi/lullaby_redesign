import ProductCard from "../components/ProductCard.jsx";
import products from "../data/products.js";
import "./ProductsPage.css";

function ProductsPage() {
  return (
    <main>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </main>
  );
}

export default ProductsPage;
