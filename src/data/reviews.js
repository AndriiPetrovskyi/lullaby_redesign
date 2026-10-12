// Real customer reviews only: the customer's own words (trim or fix typos,
// never rewrite), shared with their permission. `productSlug: null` shows the
// review on every product page.
//
// {
//   id: "emily-r-2026-09",
//   productSlug: "sunwashed",
//   name: "Emily R.",
//   location: "USA",
//   rating: 5,
//   text: "…",
//   date: "2026-09-14",
//   source: "Instagram",
// }
export const REVIEWS = [];

// Layout preview for `npm run dev` only. Never rendered in production builds.
const SAMPLE_REVIEWS = import.meta.env.DEV
  ? [1, 2, 3, 4].map((n) => ({
      id: `sample-${n}`,
      productSlug: null,
      name: `Sample review ${n}`,
      location: "Placeholder",
      rating: 5,
      text: "Placeholder text to preview the layout. Replace with a real customer's words before going live.",
      date: "2026-10-01",
      source: "Instagram",
    }))
  : [];

export function getProductReviews(slug) {
  const pool = REVIEWS.length === 0 ? SAMPLE_REVIEWS : REVIEWS;
  return pool.filter(
    (review) => review.productSlug === null || review.productSlug === slug,
  );
}
