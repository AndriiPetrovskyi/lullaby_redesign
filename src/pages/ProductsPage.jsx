import ProductCard from "../components/ProductCard.jsx";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";
import Seo from "../components/Seo.jsx";
import { absoluteUrl } from "../config/seo.js";
import { useProducts } from "../hooks/useProducts.js";
import { buildItemListJsonLd } from "../utils/seo.js";
import "./ProductsPage.css";

const PRODUCTS_SEO_PROPS = {
  title: "All Scents",
  description:
    "Browse every Lullaby scent — hand-poured candles in hand-glazed ceramic vessels, each with a packet of seeds hidden inside.",
  path: "/products",
};

const SKELETON_COUNT = 6;

function ProductsPage() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return (
      <>
        <Seo {...PRODUCTS_SEO_PROPS} />
        <main>
          <h1 className="h1-heading products-page-title">All Scents</h1>
          <div className="products-grid">
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo {...PRODUCTS_SEO_PROPS} />
        <main>
          <h1 className="h1-heading products-page-title">All Scents</h1>
          <p className="body-text products-page-message">
            We couldn't load the candles. Please try again shortly.
          </p>
        </main>
      </>
    );
  }

  return (
    <>
      <Seo {...PRODUCTS_SEO_PROPS} jsonLd={buildItemListJsonLd(products, absoluteUrl)} />
      <main>
        <h1 className="h1-heading products-page-title">All Scents</h1>
        {products.length > 0 && (
          <p className="products-page-count">
            {products.length} {products.length === 1 ? "candle" : "candles"}
          </p>
        )}
        {products.length === 0 ? (
          <p className="body-text products-page-message">
            No candles here yet — check back soon.
          </p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default ProductsPage;
