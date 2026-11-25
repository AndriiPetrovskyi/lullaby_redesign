import { notFound } from "next/navigation";
import { pageMetadata } from "../../../src/lib/metadata.js";
import { fetchProduct } from "../../../src/lib/serverApi.js";
import { toMetaDescription } from "../../../src/utils/seo.js";
import { ProductView } from "../../../src/views/client.jsx";

// Next needs a literal here; the same 5 minutes as REVALIDATE_SECONDS.
export const revalidate = 300;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const path = `/products/${slug}`;
  const product = await fetchProduct(slug);
  if (product === null) return pageMetadata({ path, title: "Product Not Found", noindex: true });
  if (!product) return pageMetadata({ path });
  return pageMetadata({
    path,
    title: product.name,
    description: toMetaDescription(product.description),
    // Resized by the backend; full-size originals can exceed Facebook's 8 MB limit.
    image: product.image ? `${product.image}?w=1200` : undefined,
    type: "product",
  });
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  // The same request as in generateMetadata; Next fetches it once.
  const product = await fetchProduct(slug);
  if (product === null) notFound();
  return (
    <>
      {/* React moves this into <head>. */}
      {product && <meta property="og:type" content="product" />}
      <ProductView />
    </>
  );
}
