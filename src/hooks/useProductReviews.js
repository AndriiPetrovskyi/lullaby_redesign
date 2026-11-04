import { useEffect, useMemo, useState } from "react";
import { getReviews } from "../services/reviews.js";

// Every candle shows the whole store's reviews, this candle's first; each one
// names the candle it's about. They're an extra on the page: if they can't
// load, it simply shows none.
export function useProductReviews(slug) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getReviews()
      .then((data) => {
        if (!cancelled) setReviews(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () =>
      [...reviews].sort(
        (a, b) => (b.productSlug === slug) - (a.productSlug === slug),
      ),
    [reviews, slug],
  );
}
