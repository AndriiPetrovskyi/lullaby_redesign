import { DEFAULT_OG_IMAGE, SITE_NAME } from "../../src/config/seo.js";
import { toMetaDescription } from "../../src/utils/seo.js";
import ClientApp from "./ClientApp.jsx";

// Every URL is served by the current storefront (ClientApp). This page only
// gives each one its own title, description and preview tags in the HTML, for
// link-preview bots and search engines that don't run JavaScript; once the
// app runs, its <Seo> keeps the title in step as before.

const API_BASE_URL = process.env.VITE_API_BASE_URL;

// Products change in the admin; pages pick that up within five minutes.
export const revalidate = 300;

const STATIC_PAGES = {
  "/products": {
    title: "All Scents",
    description:
      "Browse every Lullaby scent — hand-poured candles in handmade gypsum vessels, each with a handwritten message in a vial tucked inside.",
  },
  "/about": {
    title: "About Us",
    description:
      "The story behind Lullaby — handmade candles in gypsum vessels, poured with natural soy wax, with a handwritten message in a vial tucked inside every one.",
  },
  "/contact": {
    title: "Contact Us",
    description:
      "Get in touch with Lullaby — questions about orders, direct orders, shipping, or anything else.",
  },
  "/terms": {
    title: "Terms & Conditions",
    description:
      "Lullaby's terms and conditions — ordering, payment, shipping, returns, and candle care.",
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    description:
      "How Lullaby collects, uses, and protects your information — including analytics and advertising cookies.",
  },
};

const NOINDEX_PAGES = {
  "/checkout/success": "Thank you",
  "/checkout/cancel": "Payment cancelled",
};

async function fetchProduct(slug) {
  // Relative in the local phone setup (Vite-style /api proxy): no server fetch.
  if (!API_BASE_URL?.startsWith("http")) return undefined;
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate },
    });
    if (res.status === 404) return null;
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

function pageMetadata({ path, title, description, image, type = "website", noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Handmade Scented Candles`;
  return {
    title: fullTitle,
    ...(description && { description }),
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      // Next accepts only its own og:type values, so a product page gets its
      // og:type from the page itself (see Page below).
      ...(type === "website" && { type }),
      siteName: SITE_NAME,
      title: fullTitle,
      ...(description && { description }),
      url: path,
      images: [image ?? DEFAULT_OG_IMAGE],
    },
    twitter: { card: "summary_large_image" },
  };
}

export async function generateMetadata({ params }) {
  const segments = (await params).slug ?? [];
  const path = `/${segments.join("/")}`;

  if (path === "/") return pageMetadata({ path });
  if (STATIC_PAGES[path]) return pageMetadata({ path, ...STATIC_PAGES[path] });
  if (NOINDEX_PAGES[path]) return pageMetadata({ path, title: NOINDEX_PAGES[path], noindex: true });
  if (segments[0] === "checkout" && segments.length === 2) {
    return pageMetadata({ path, title: "Checkout", noindex: true });
  }
  if (segments[0] === "products" && segments.length === 2) {
    const product = await fetchProduct(segments[1]);
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
  return pageMetadata({ path: "/404", title: "Page Not Found", noindex: true });
}

export default async function Page({ params }) {
  const segments = (await params).slug ?? [];
  // The same request as in generateMetadata; Next fetches it once.
  const product =
    segments[0] === "products" && segments.length === 2
      ? await fetchProduct(segments[1])
      : undefined;
  return (
    <>
      {/* React moves this into <head>. */}
      {product && <meta property="og:type" content="product" />}
      <ClientApp />
    </>
  );
}
