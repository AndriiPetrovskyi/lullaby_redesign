export function toMetaDescription(text, max = 160) {
  if (!text) return undefined;
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export function buildProductJsonLd(product, url) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: toMetaDescription(product.description, 500),
    image: [product.image, ...(product.gallery ?? [])].filter(Boolean),
    sku: product.id,
    brand: { "@type": "Brand", name: "Lullaby" },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "USD",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };
}

export function buildItemListJsonLd(products, absoluteUrl) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/products/${product.slug}`),
      name: product.name,
    })),
  };
}
