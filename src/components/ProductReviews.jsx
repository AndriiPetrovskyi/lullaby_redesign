import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ORDERS_COUNT } from "../config/contact.js";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { responsiveImage } from "../utils/images.js";
import "./ProductReviews.css";

const INITIAL_COUNT = 3;
const INITIAL_COUNT_DESKTOP = 4;
const REVIEWS_SECTION_ID = "reviews";
// Shown at 40px; 200 is the smallest size the image server makes.
const PHOTO_WIDTHS = [200];

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

// Long reviews start at a few lines (`.reviews-text--clamped`) with a "Read
// more" that opens them in place. How much fits depends on the width and the
// font, so it's measured rather than guessed from the number of characters.
function ReviewText({ text }) {
  const textRef = useRef(null);
  const [isLong, setIsLong] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const element = textRef.current;
    if (!element || isOpen) return undefined;
    const measure = () => setIsLong(element.scrollHeight > element.clientHeight + 1);
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, [isOpen, text]);

  return (
    <div className="reviews-body">
      <p
        ref={textRef}
        className={`reviews-text${isOpen ? "" : " reviews-text--clamped"}`}>
        {text}
      </p>
      {(isLong || isOpen) && (
        <button
          type="button"
          className="reviews-read-more"
          aria-expanded={isOpen}
          onClick={() => setIsOpen((value) => !value)}>
          {isOpen ? "Read less" : "Read more"}
        </button>
      )}
    </div>
  );
}

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

// Above the candle's name: the store's rating, and how many orders it's had.
// The count says "orders", so nobody reads it as the number of ratings.
export function ReviewsSummaryLink({ reviews }) {
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
      className="reviews-summary-link"
      onClick={scrollToReviews}>
      <Stars rating={averageRating(reviews)} />
      <span>
        {averageRating(reviews).toFixed(1)} ({ORDERS_COUNT}{" "}
        {ORDERS_COUNT === 286 ? "orders" : "orders"})
      </span>
    </a>
  );
}

function ProductReviews({ reviews }) {
  const [showAll, setShowAll] = useState(false);
  const isMobile = useIsMobile();
  if (reviews.length === 0) return null;

  // One full row on desktop.
  const initialCount = isMobile ? INITIAL_COUNT : INITIAL_COUNT_DESKTOP;
  const visible = showAll ? reviews : reviews.slice(0, initialCount);
  const average = averageRating(reviews);

  return (
    <section className="reviews" id={REVIEWS_SECTION_ID}>
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
            <div className="reviews-author">
              {review.image && (
                <img
                  className="reviews-photo"
                  {...responsiveImage(review.image, PHOTO_WIDTHS, "40px")}
                  alt=""
                  width="40"
                  height="40"
                  loading="lazy"
                />
              )}
              <div>
                <p className="reviews-name">{review.name}</p>
                {review.location && <p className="reviews-location">{review.location}</p>}
              </div>
            </div>
            <Stars rating={review.rating} />
            {review.productSlug && (
              <p className="reviews-product">
                <Link to={`/products/${review.productSlug}`}>{review.productName}</Link>
              </p>
            )}
            <ReviewText text={review.text} />
            <p className="reviews-source">
              {formatDate(review.date)}
              {review.source && <> · via {review.source}</>}
            </p>
          </li>
        ))}
      </ul>

      {reviews.length > initialCount && (
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
