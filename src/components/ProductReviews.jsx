import { useState } from "react";
import "./ProductReviews.css";

const INITIAL_COUNT = 3;
export const REVIEWS_SECTION_ID = "reviews";

function averageRating(reviews) {
  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

function Stars({ rating }) {
  const filled = Math.round(rating);
  return (
    <span className="reviews-stars" aria-label={`${rating} out of 5 stars`}>
      <span aria-hidden="true">
        {"★".repeat(filled)}
        <span className="reviews-stars-empty">{"★".repeat(5 - filled)}</span>
      </span>
    </span>
  );
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function ReviewsSummaryLink({ reviews, className = "" }) {
  if (reviews.length === 0) return null;

  const scrollToReviews = (event) => {
    event.preventDefault();
    document
      .getElementById(REVIEWS_SECTION_ID)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <a
      href={`#${REVIEWS_SECTION_ID}`}
      className={`reviews-summary-link ${className}`.trim()}
      onClick={scrollToReviews}>
      <Stars rating={averageRating(reviews)} />
      <span>
        {averageRating(reviews).toFixed(1)} · {reviews.length}{" "}
        {reviews.length === 1 ? "review" : "reviews"}
      </span>
    </a>
  );
}

function ProductReviews({ reviews }) {
  const [showAll, setShowAll] = useState(false);
  if (reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const average = averageRating(reviews);

  return (
    <section className="reviews" id={REVIEWS_SECTION_ID}>
      <div className="reviews-header">
        <h2 className="reviews-title">Reviews</h2>
        <p className="reviews-average">
          <Stars rating={average} />
          <span>
            {average.toFixed(1)} out of 5 · {reviews.length}{" "}
            {reviews.length === 1 ? "review" : "reviews"}
          </span>
        </p>
      </div>

      <ul className="reviews-list">
        {visible.map((review) => (
          <li className="reviews-card" key={review.id}>
            <Stars rating={review.rating} />
            <p className="reviews-text">{review.text}</p>
            <p className="reviews-meta">
              <span className="reviews-name">{review.name}</span>
              {review.location && <>, {review.location}</>}
              <span className="reviews-source">
                {formatDate(review.date)}
                {review.source && <> · via {review.source}</>}
              </span>
            </p>
          </li>
        ))}
      </ul>

      {reviews.length > INITIAL_COUNT && (
        <button
          type="button"
          className="reviews-more"
          onClick={() => setShowAll((value) => !value)}>
          {showAll ? "Show fewer reviews" : `Show all ${reviews.length} reviews`}
        </button>
      )}
    </section>
  );
}

export default ProductReviews;
