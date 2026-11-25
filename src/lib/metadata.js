import { DEFAULT_OG_IMAGE, SITE_NAME } from "../config/seo.js";

// Each page's <title>, description, canonical and preview tags, in Next's
// metadata format; the same values the old prerender script wrote.
export function pageMetadata({ path, title, description, image, type = "website", noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Handmade Scented Candles`;
  return {
    title: fullTitle,
    ...(description && { description }),
    alternates: { canonical: path },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      // Next accepts only its own og:type values, so a product page renders
      // its og:type itself.
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
