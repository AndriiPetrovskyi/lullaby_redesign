import { useState } from "react";
import { Link } from "react-router-dom";
import { responsiveImage } from "../utils/images.js";
import "./ProductReviews.css";

const INITIAL_COUNT = 3;
const PHOTO_WIDTHS = [400, 800];

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

function ProductReviews({ reviews }) {
  const [showAll, setShowAll] = useState(false);
  if (reviews.length === 0) return null;

  const visible = showAll ? reviews : reviews.slice(0, INITIAL_COUNT);
  const average = averageRating(reviews);

  return (
    <section className="reviews" id="reviews">
      <div className="reviews-header">
        <h2 className="reviews-title">What our customers say</h2>
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
            {review.image && (
              <img
                className="reviews-photo"
                {...responsiveImage(review.image, PHOTO_WIDTHS, "(max-width: 768px) 100vw, 400px")}
                alt={`From ${review.name}`}
                loading="lazy"
              />
            )}
            <Stars rating={review.rating} />
            <p className="reviews-text">{review.text}</p>
            {review.productSlug && (
              <p className="reviews-product">
                Purchased:{" "}
                <Link to={`/products/${review.productSlug}`}>{review.productName}</Link>
              </p>
            )}
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
