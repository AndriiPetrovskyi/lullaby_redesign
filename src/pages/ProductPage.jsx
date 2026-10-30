import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useIsMobile } from "../hooks/useIsMobile.js";
import { useProduct } from "../hooks/useProducts.js";
import LoadingScreen from "../components/LoadingScreen.jsx";
import GuaranteesMarquee from "../components/GuaranteesMarquee.jsx";
import MoreScents from "../components/MoreScents.jsx";
import ProductReviews, {
  ReviewsSummaryLink,
} from "../components/ProductReviews.jsx";
import { getProductReviews } from "../data/reviews.js";
import MutableVideo from "../components/MutableVideo.jsx";
import Modal from "../components/Modal.jsx";
import Seo from "../components/Seo.jsx";
import { InstagramIcon, MailIcon } from "../components/icons/SocialIcons.jsx";
import Slider from "../mobile/components/Slider.jsx";
import BuyBar from "../mobile/components/BuyBar.jsx";
import { DEFAULT_OG_IMAGE, absoluteUrl } from "../config/seo.js";
import { buildProductJsonLd, toMetaDescription } from "../utils/seo.js";
import { trackCustomEvent, trackEvent } from "../utils/metaPixel.js";
import { CHECKOUT_ENABLED, ORDERING_PAUSED } from "../config/ordering.js";
import { PayPalLogo, SecureCheckoutBox } from "../components/PaymentMethods.jsx";
import RedirectNotice from "../components/RedirectNotice.jsx";
import {
  createOrder,
  getCheckoutConfig,
  orderTrackingFields,
  readCheckoutDraft,
  redirectToPayment,
  saveCheckoutDraft,
} from "../services/orders.js";
import { gaItem, trackGaEvent } from "../utils/googleAnalytics.js";
import { responsiveImage, uniquePhotos, withPhotoFirst } from "../utils/images.js";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HANDLE,
  DAMAGE_REPORT_HOURS,
  DELIVERY_TIME,
  DISPATCH_TIME,
  FREE_SHIPPING_REGIONS,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MOR_DISCLAIMER,
  RETURN_WINDOW_DAYS,
} from "../config/contact.js";
import jarProcessVideo from "../assets/process.mp4";
import boxProcessVideo from "../assets/video2.MP4";
import jarProcessPoster from "../assets/process-poster.webp";
import boxProcessPoster from "../assets/video2-poster.webp";
import vesselPlanterImage from "../assets/fl3.jpeg";
import vialImage from "../assets/notes/vial-and-pen.webp";
import notesAndVialImage from "../assets/notes/notes-and-vial.webp";
import penWritingImage from "../assets/notes/pen-writing.webp";
import "./ProductPage.css";

// Shown after every candle's own photos: the Message in a Vial that ships
// with it.
const VIAL_GALLERY_PHOTOS = [notesAndVialImage, vialImage, penWritingImage];

const MOBILE_GALLERY_WIDTHS = [600, 800, 1200];
const DESKTOP_GALLERY_WIDTHS = [800, 1200, 1600];

const PRODUCT_INFO_SECTIONS = [
  {
    title: "Details",
    rows: [
      ["Burn time", "Approx. 40 hours"],
      ["Vessel", "Hand-finished gypsum, sealed and washable"],
      ["Wick", "Cotton"],
      ["Wax", "Soy"],
      ["Size", "3.9 × 3.9 in (10 × 10 cm)"],
    ],
  },
  {
    title: "Shipping & Delivery",
    content: `Free shipping to ${FREE_SHIPPING_REGIONS}. Orders ship within ${DISPATCH_TIME}; delivery typically takes ${DELIVERY_TIME} depending on location.`,
  },
  {
    title: "Payment",
    content: `Pay by card (including Apple Pay and Google Pay, where available) or PayPal. ${MOR_DISCLAIMER}`,
  },
  {
    title: "Returns & Damaged Items",
    content: `We accept returns within ${RETURN_WINDOW_DAYS} days of delivery. If your item arrives damaged, contact us within ${DAMAGE_REPORT_HOURS} hours for a replacement.`,
  },
];

function ProductInfoContent({ section, className }) {
  if (!section.rows) return <p className={className}>{section.content}</p>;
  return (
    <dl className={`${className} product-details`}>
      {section.rows.map(([label, value]) => (
        <div className="product-details-row" key={label}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function ProductPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const adPhoto = searchParams.get("photo");
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { product, isLoading, error } = useProduct(slug);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [openInfoSections, setOpenInfoSections] = useState(() => new Set());
  const [isDirectOrderModalOpen, setIsDirectOrderModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  // Visitors where card payments aren't allowed (Ukraine) pay with PayPal.
  const [cardAvailable, setCardAvailable] = useState(true);
  // Going straight to PayPal: null, or { method, error } while the order is
  // created (error set if that failed).
  const [payment, setPayment] = useState(null);

  // Back from PayPal via the browser's back button restores this page from
  // the back-forward cache, still showing "Taking you to PayPal…".
  useEffect(() => {
    const onPageShow = (event) => event.persisted && setPayment(null);
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!CHECKOUT_ENABLED) return;
    getCheckoutConfig()
      .then((config) => setCardAvailable(!config.cardUnavailableInRegion))
      .catch(() => {});
  }, []);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    trackEvent("ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      value: product.price,
      currency: "USD",
    });
    trackGaEvent("view_item", gaItem(product));
  }, [product]);

  const toggleInfoSection = (index) => {
    setOpenInfoSections((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  if (isLoading) {
    return (
      <main>
        <LoadingScreen />
      </main>
    );
  }

  if (error || !product) {
    return (
      <>
        <Seo title="Product Not Found" path={`/products/${slug}`} noindex />
        <main>
          <h1 className="h1-heading">Product Not Found</h1>
        </main>
      </>
    );
  }

  const reviews = getProductReviews(product.slug);

  const productSeo = (
    <Seo
      title={product.name}
      description={toMetaDescription(product.description)}
      path={`/products/${product.slug}`}
      image={product.image ?? DEFAULT_OG_IMAGE}
      type="product"
      jsonLd={buildProductJsonLd(
        product,
        absoluteUrl(`/products/${product.slug}`),
      )}
    />
  );

  // "Buy now" records purchase intent (InitiateCheckout — the ad campaign
  // optimizes for it, so its payload is unchanged), then goes to the site's
  // own checkout, or — until that is switched on — to the Etsy step.
  // Stock only gates the site's own checkout; Etsy keeps its own count.
  const isSoldOut = CHECKOUT_ENABLED && product.stock < 1;
  const canBuy = !ORDERING_PAUSED && !isSoldOut;
  const buyLabel = ORDERING_PAUSED
    ? "Currently unavailable"
    : isSoldOut
      ? "Sold out"
      : "Buy now";

  // Card buyers go to our checkout, which asks only for the email (Stripe
  // needs it). PayPal needs nothing from us, so its button goes straight to
  // PayPal, where the buyer picks the shipping address.
  const canPayWithPayPal = CHECKOUT_ENABLED && canBuy;

  const payWithPayPal = async () => {
    setPayment({ method: "paypal", error: null });
    try {
      const order = await createOrder({
        productSlug: product.slug,
        quantity: 1,
        paymentMethod: "paypal",
        express: true,
        ...orderTrackingFields(),
      });
      // The cancel page links back here, not to the card checkout.
      saveCheckoutDraft(product.slug, { ...readCheckoutDraft(product.slug), method: "paypal" });
      trackEvent("AddPaymentInfo", {
        content_ids: [product.id],
        content_name: product.name,
        value: product.price,
        currency: "USD",
      });
      trackGaEvent("add_payment_info", { ...gaItem(product), payment_type: "paypal" });
      redirectToPayment(order);
    } catch (err) {
      setPayment({ method: "paypal", error: err.message });
    }
  };

  const handleBuyClick = (paymentMethod) => {
    if (!canBuy) return;
    trackEvent("InitiateCheckout", {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price,
      currency: "USD",
    });
    trackGaEvent("begin_checkout", gaItem(product));
    if (CHECKOUT_ENABLED && (paymentMethod === "paypal" || !cardAvailable)) {
      payWithPayPal();
    } else if (CHECKOUT_ENABLED) {
      navigate(`/checkout/${product.slug}`);
    } else {
      setIsCheckoutModalOpen(true);
    }
  };

  // Fires on click of a real link that opens Etsy in a new tab (as the old
  // button did), so this page stays open and the events aren't cut off —
  // no navigation delay needed, and no popup blocker trouble.
  const handleContinueToEtsy = () => {
    trackCustomEvent("ContinueToEtsy", {
      content_name: product.name,
      value: product.price,
      currency: "USD",
    });
    trackGaEvent("continue_to_etsy", gaItem(product));
  };

  const redirectNotice = payment && (
    <RedirectNotice
      paymentMethod={payment.method}
      error={payment.error}
      onClose={() => setPayment(null)}
    />
  );

  const checkoutModal = (
    <Modal
      isOpen={isCheckoutModalOpen}
      onClose={() => setIsCheckoutModalOpen(false)}
      labelledBy="checkout-modal-title">
      <p id="checkout-modal-title" className="modal-title">
        Almost there!
      </p>
      <p className="body-text modal-text">
        We use Etsy for secure checkout — your payment and order are protected
        by Etsy Purchase Protection.
      </p>
      <a
        href={product.etsyUrl}
        target="_blank"
        rel="noreferrer"
        onClick={handleContinueToEtsy}
        className="modal-checkout-button">
        Continue to checkout →
      </a>
      <p className="modal-checkout-note">Free shipping · {DELIVERY_TIME}</p>
    </Modal>
  );

  const handleDirectOrderClick = () => {
    if (ORDERING_PAUSED) return;
    trackEvent("Contact", { content_name: product.name });
    trackGaEvent("generate_lead", gaItem(product));
    setIsDirectOrderModalOpen(true);
  };

  const backLink = (
    <Link to="/products" className="product-back-link">
      <span aria-hidden="true">←</span> All scents
    </Link>
  );

  if (isMobile) {
    return (
      <main className="m-product-page">
        {productSeo}
        {backLink}
        {/* No autoplay: ad visitors land here to look at this candle, and
            auto-advancing swapped in not-yet-loaded photos. */}
        <Slider
          key={product.slug}
          autoplay={false}
          slides={withPhotoFirst(
            uniquePhotos([...(product.gallery ?? []), ...VIAL_GALLERY_PHOTOS]),
            adPhoto,
            [product.image],
          ).map((src, i) => (
            <img
              key={i}
              {...responsiveImage(src, MOBILE_GALLERY_WIDTHS, "100vw")}
              alt={`${product.name} ${i + 1}`}
              fetchPriority={i === 0 ? "high" : "auto"}
              decoding="async"
            />
          ))}
        />
        <div className="m-product-page-info">
          <ReviewsSummaryLink reviews={reviews} className="product-page-rating-top" />
          <p className="m-product-page-name">{product.name}</p>
          <p className="m-product-page-price">${product.price}</p>
          <ul className="m-product-page-perks">
            <li>
              Message in a Vial — a handwritten note inside
            </li>
            <li>
              Free shipping · {DELIVERY_TIME}
            </li>
          </ul>
          <div className="m-product-page-cta-row m-product-page-cta-row--top">
            <button
              type="button"
              onClick={() => handleBuyClick()}
              disabled={!canBuy || Boolean(payment)}
              className="m-product-page-buy-etsy">
              {buyLabel}
            </button>
            {canPayWithPayPal && (
              <button
                type="button"
                onClick={() => handleBuyClick("paypal")}
                disabled={Boolean(payment)}
                className="product-page-paypal m-product-page-paypal"
                aria-label="Pay with PayPal">
                <span aria-hidden="true">Pay with</span> <PayPalLogo />
              </button>
            )}
            {CHECKOUT_ENABLED && <SecureCheckoutBox />}
            {!ORDERING_PAUSED && (
              <p className="m-product-page-direct-line">
                Prefer another way to pay?{" "}
                <button
                  type="button"
                  className="m-product-page-direct-order"
                  onClick={handleDirectOrderClick}>
                  Order directly
                </button>
              </p>
            )}
          </div>

          {product.fragranceNotes && (
            <div className="m-product-page-notes">
              <p className="m-product-page-notes-title">Fragrance Notes</p>
              <p className="m-product-page-notes-row">
                <span>Top:</span> {product.fragranceNotes.top}
              </p>
              <p className="m-product-page-notes-row">
                <span>Heart:</span> {product.fragranceNotes.heart}
              </p>
              <p className="m-product-page-notes-row">
                <span>Base:</span> {product.fragranceNotes.base}
              </p>
            </div>
          )}

          <div className="m-product-page-accordion">
            <motion.div
              className={
                isDescriptionOpen
                  ? "m-product-page-description-wrap"
                  : "m-product-page-description-wrap m-product-page-description-wrap--collapsed"
              }
              initial={false}
              animate={{ height: isDescriptionOpen ? "auto" : 60 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <p className="body-text m-product-page-description">
                {product.description}
              </p>
            </motion.div>
            <button
              type="button"
              className="m-product-page-accordion-toggle"
              aria-expanded={isDescriptionOpen}
              onClick={() => setIsDescriptionOpen((open) => !open)}>
              {isDescriptionOpen ? "Read less" : "Read more"}
            </button>
          </div>

          <div className="m-product-page-faq">
            {PRODUCT_INFO_SECTIONS.map((section, i) => {
              const isOpen = openInfoSections.has(i);
              return (
                <div className="m-product-page-faq-item" key={section.title}>
                  <button
                    type="button"
                    className="m-product-page-faq-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleInfoSection(i)}>
                    {section.title}
                    <motion.span
                      className="m-product-page-faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="m-product-page-faq-content-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <ProductInfoContent
                          section={section}
                          className="body-text m-product-page-faq-content"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="m-product-page-gift-section">
            <p className="m-product-page-gift-title">
              The Perfect Frame. A Ready-to-Give Gift.
            </p>
            <div className="m-product-page-video-frame">
              <MutableVideo
                className="m-product-page-video"
                src={boxProcessVideo}
                poster={boxProcessPoster}></MutableVideo>
            </div>
            <p className="m-product-page-gift-caption">
              Ready to gift, straight out of the box — no extra wrapping, no
              last-minute run to the store.
            </p>
          </div>

          <div className="m-product-page-vessel-section">
            <p className="m-product-page-vessel-title">Message in a Vial.</p>
            <div className="m-product-page-video-frame">
              <img
                className="m-product-page-video"
                src={vialImage}
                alt="A corked glass vial holding a rolled handwritten note, beside an ink pen"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="m-product-page-vessel-caption">
              Every candle comes with a tiny corked vial and a note written by
              hand, in ink — a small thought to keep you company.
            </p>
          </div>

          <div className="m-product-page-video-section">
            <p className="m-product-page-video-title">
              Crafted, not mass-produced: art in every detail.
            </p>
            <div className="m-product-page-video-frame">
              <MutableVideo
                className="m-product-page-video"
                src={jarProcessVideo}
                poster={jarProcessPoster}></MutableVideo>
            </div>
            <p className="m-product-page-video-caption">
              Poured by hand, one candle at a time — every pour a little
              different from the last.
            </p>
          </div>

          <div className="m-product-page-vessel-section">
            <p className="m-product-page-vessel-title">
              Don't throw the vessel away.
              <br />
              Plant a flower in it.
            </p>
            <div className="m-product-page-video-frame">
              <img
                className="m-product-page-video"
                src={vesselPlanterImage}
                alt="A Lullaby vessel reused as a planter"
                loading="lazy"
                decoding="async"
              />
            </div>
            <p className="m-product-page-vessel-caption">
              Burn the candle, keep the vessel, and grow something new — a small
              ritual that keeps on giving.
            </p>
          </div>

          <div className="m-product-page-closing-section">
            <p className="body-text m-product-page-closing-text">
              From the first touch of raw material to the handwritten note
              waiting inside.
              <span className="m-product-page-closing-text-emphasis">
                We've created not just an object, but an emotion—perfectly
                packaged and ready to be your ultimate gift.
              </span>
            </p>
            <div className="m-product-page-cta-row m-product-page-cta-row--closing">
              <button
              type="button"
              onClick={() => handleBuyClick()}
              disabled={!canBuy || Boolean(payment)}
              className="m-product-page-buy-etsy">
              {buyLabel}
            </button>
              {canPayWithPayPal && (
                <button
                  type="button"
                  onClick={() => handleBuyClick("paypal")}
                  disabled={Boolean(payment)}
                  className="product-page-paypal m-product-page-paypal"
                  aria-label="Pay with PayPal">
                  <span aria-hidden="true">Pay with</span> <PayPalLogo />
                </button>
              )}
              {CHECKOUT_ENABLED && <SecureCheckoutBox />}
            {!ORDERING_PAUSED && (
              <p className="m-product-page-direct-line">
                Prefer another way to pay?{" "}
                <button
                  type="button"
                  className="m-product-page-direct-order"
                  onClick={handleDirectOrderClick}>
                  Order directly
                </button>
              </p>
            )}
            </div>
          </div>
        </div>

        <ProductReviews reviews={reviews} />

        <GuaranteesMarquee className="product-page-marquee" />

        <MoreScents currentSlug={product.slug} />

        {canBuy && (
          <BuyBar
            name={product.name}
            price={product.price}
            onBuy={() => handleBuyClick()}
            firstCtaSelector=".m-product-page-cta-row--top"
            lastCtaSelector=".m-product-page-cta-row--closing"
          />
        )}

        {checkoutModal}
        {redirectNotice}

        <Modal
          isOpen={isDirectOrderModalOpen}
          onClose={() => setIsDirectOrderModalOpen(false)}>
          <p className="modal-title">Prefer a direct order?</p>
          <p className="body-text modal-text">
            Secure your order directly through us. Reach out via Instagram or
            Email, and we will quickly arrange your payment through PayPal or
            Payoneer. We usually reply within a few hours to finalize your
            handmade order.
          </p>
          <div className="modal-contacts">
            <a href={`mailto:${CONTACT_EMAIL}`} className="modal-contact-link">
              <MailIcon className="modal-contact-icon" />
              {CONTACT_EMAIL_HANDLE}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="modal-contact-link">
              <InstagramIcon className="modal-contact-icon" />
              {INSTAGRAM_HANDLE}
            </a>
          </div>
        </Modal>
      </main>
    );
  }

  const galleryImages = withPhotoFirst(
    uniquePhotos([product.image, ...(product.gallery ?? []), ...VIAL_GALLERY_PHOTOS]),
    adPhoto,
  );

  return (
    <main className="d-product-page">
      {productSeo}
      {backLink}
      <div className="d-product-page-top">
          <div className="d-product-page-gallery">
          <div className="d-product-page-gallery-stage">
            <motion.img
              key={activeImage}
              className="d-product-page-gallery-main"
              {...responsiveImage(
                galleryImages[activeImage] ?? galleryImages[0],
                DESKTOP_GALLERY_WIDTHS,
                "50vw",
              )}
              alt={product.name}
              fetchPriority="high"
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
            {galleryImages.length > 1 && (
              <>
                <button
                  type="button"
                  className="d-product-page-gallery-arrow d-product-page-gallery-arrow--prev"
                  onClick={() =>
                    setActiveImage((i) =>
                      i === 0 ? galleryImages.length - 1 : i - 1,
                    )
                  }
                  aria-label="Previous photo">
                  ‹
                </button>
                <button
                  type="button"
                  className="d-product-page-gallery-arrow d-product-page-gallery-arrow--next"
                  onClick={() =>
                    setActiveImage((i) =>
                      i === galleryImages.length - 1 ? 0 : i + 1,
                    )
                  }
                  aria-label="Next photo">
                  ›
                </button>
              </>
            )}
          </div>
          {galleryImages.length > 1 && (
            <div className="d-product-page-thumbs">
              {galleryImages.map((src, i) => (
                <button
                  type="button"
                  key={i}
                  className={
                    i === activeImage
                      ? "d-product-page-thumb d-product-page-thumb--active"
                      : "d-product-page-thumb"
                  }
                  onClick={() => setActiveImage(i)}
                  aria-label={`${product.name} — photo ${i + 1}`}>
                  <img
                    {...responsiveImage(src, [200, 400], "100px")}
                    alt={`${product.name} ${i + 1}`}
                    loading="lazy"
                    decoding="async"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="d-product-page-info">
          <ReviewsSummaryLink reviews={reviews} className="product-page-rating-top" />
          <h1 className="d-product-page-name">{product.name}</h1>
          <p className="d-product-page-price">${product.price}</p>
          <ul className="d-product-page-perks">
            <li>Message in a Vial — a handwritten note inside</li>
            <li>Free shipping · {DELIVERY_TIME}</li>
          </ul>

          <div className="d-product-page-cta-row d-product-page-cta-row--top">
            <button
              type="button"
              onClick={() => handleBuyClick()}
              disabled={!canBuy || Boolean(payment)}
              className="d-product-page-buy-etsy">
              {buyLabel}
            </button>
            {canPayWithPayPal && (
              <button
                type="button"
                onClick={() => handleBuyClick("paypal")}
                disabled={Boolean(payment)}
                className="product-page-paypal d-product-page-paypal"
                aria-label="Pay with PayPal">
                <span aria-hidden="true">Pay with</span> <PayPalLogo />
              </button>
            )}
            {CHECKOUT_ENABLED && <SecureCheckoutBox />}
            {!ORDERING_PAUSED && (
              <p className="d-product-page-direct-line">
                Prefer another way to pay?{" "}
                <button
                  type="button"
                  className="d-product-page-direct-order"
                  onClick={handleDirectOrderClick}>
                  Order directly
                </button>
              </p>
            )}
          </div>

          {product.fragranceNotes && (
            <div className="d-product-page-notes">
              <p className="d-product-page-notes-title">Fragrance Notes</p>
              <p className="d-product-page-notes-row">
                <span>Top:</span> {product.fragranceNotes.top}
              </p>
              <p className="d-product-page-notes-row">
                <span>Heart:</span> {product.fragranceNotes.heart}
              </p>
              <p className="d-product-page-notes-row">
                <span>Base:</span> {product.fragranceNotes.base}
              </p>
            </div>
          )}

          <div className="d-product-page-accordion">
            <motion.div
              className={
                isDescriptionOpen
                  ? "d-product-page-description-wrap"
                  : "d-product-page-description-wrap d-product-page-description-wrap--collapsed"
              }
              initial={false}
              animate={{ height: isDescriptionOpen ? "auto" : 108 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}>
              <p className="body-text d-product-page-description">
                {product.description}
              </p>
            </motion.div>
            <button
              type="button"
              className="d-product-page-accordion-toggle"
              aria-expanded={isDescriptionOpen}
              onClick={() => setIsDescriptionOpen((open) => !open)}>
              {isDescriptionOpen ? "Read less" : "Read more"}
            </button>
          </div>

          <div className="d-product-page-faq">
            {PRODUCT_INFO_SECTIONS.map((section, i) => {
              const isOpen = openInfoSections.has(i);
              return (
                <div className="d-product-page-faq-item" key={section.title}>
                  <button
                    type="button"
                    className="d-product-page-faq-toggle"
                    aria-expanded={isOpen}
                    onClick={() => toggleInfoSection(i)}>
                    {section.title}
                    <motion.span
                      className="d-product-page-faq-icon"
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}>
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="d-product-page-faq-content-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}>
                        <ProductInfoContent
                          section={section}
                          className="body-text d-product-page-faq-content"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <section className="d-product-page-story">
        <div className="d-product-page-story-media">
          <MutableVideo
            className="d-product-page-video"
            src={boxProcessVideo}
                poster={boxProcessPoster}></MutableVideo>
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            The Perfect Frame. A Ready-to-Give Gift.
          </p>
          <p className="d-product-page-story-caption">
            Ready to gift, straight out of the box — no extra wrapping, no
            last-minute run to the store.
          </p>
        </div>
      </section>

      <section className="d-product-page-story d-product-page-story--reverse">
        <div className="d-product-page-story-media">
          <img
            className="d-product-page-video"
            src={vialImage}
            alt="A corked glass vial holding a rolled handwritten note, beside an ink pen"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">Message in a Vial.</p>
          <p className="d-product-page-story-caption">
            Every candle comes with a tiny corked vial and a note written by
            hand, in ink — a small thought to keep you company, like &ldquo;The
            world won&apos;t stop spinning if you take a rest.&rdquo;
          </p>
        </div>
      </section>

      <section className="d-product-page-story">
        <div className="d-product-page-story-media">
          <MutableVideo
            className="d-product-page-video"
            src={jarProcessVideo}
                poster={jarProcessPoster}></MutableVideo>
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            Crafted, not mass-produced: art in every detail.
          </p>
          <p className="d-product-page-story-caption">
            Poured by hand, one candle at a time — every pour a little different
            from the last.
          </p>
        </div>
      </section>

      <section className="d-product-page-story d-product-page-story--reverse">
        <div className="d-product-page-story-media">
          <img
            className="d-product-page-video"
            src={vesselPlanterImage}
            alt="A Lullaby vessel reused as a planter"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="d-product-page-story-text">
          <p className="d-product-page-story-title">
            Don&apos;t throw the vessel away. Plant a flower in it.
          </p>
          <p className="d-product-page-story-caption">
            Burn the candle, keep the vessel, and grow something new — a small
            ritual that keeps on giving.
          </p>
        </div>
      </section>

      <div className="d-product-page-inner">
        <section className="d-product-page-closing-section">
        <p className="d-product-page-closing-text">
          From the first touch of raw material to the handwritten note
          waiting inside.
          <span className="d-product-page-closing-text-emphasis">
            We&apos;ve created not just an object, but an emotion—perfectly
            packaged and ready to be your ultimate gift.
          </span>
        </p>
        <div className="d-product-page-cta-row d-product-page-cta-row--closing">
            <button
              type="button"
              onClick={() => handleBuyClick()}
              disabled={!canBuy || Boolean(payment)}
              className="d-product-page-buy-etsy">
              {buyLabel}
            </button>
            {canPayWithPayPal && (
              <button
                type="button"
                onClick={() => handleBuyClick("paypal")}
                disabled={Boolean(payment)}
                className="product-page-paypal d-product-page-paypal"
                aria-label="Pay with PayPal">
                <span aria-hidden="true">Pay with</span> <PayPalLogo />
              </button>
            )}
            {CHECKOUT_ENABLED && <SecureCheckoutBox />}
            {!ORDERING_PAUSED && (
              <p className="d-product-page-direct-line">
                Prefer another way to pay?{" "}
                <button
                  type="button"
                  className="d-product-page-direct-order"
                  onClick={handleDirectOrderClick}>
                  Order directly
                </button>
              </p>
            )}
        </div>
        </section>
      </div>

      <ProductReviews reviews={reviews} />

      <GuaranteesMarquee className="product-page-marquee" />

      <MoreScents currentSlug={product.slug} />

      {canBuy && (
        <BuyBar
          name={product.name}
          price={product.price}
          onBuy={() => handleBuyClick()}
          firstCtaSelector=".d-product-page-cta-row--top"
          lastCtaSelector=".d-product-page-cta-row--closing"
        />
      )}

      {checkoutModal}
      {redirectNotice}

      <Modal
        isOpen={isDirectOrderModalOpen}
        onClose={() => setIsDirectOrderModalOpen(false)}>
        <p className="modal-title">Prefer a direct order?</p>
        <p className="body-text modal-text">
          Secure your order directly through us. Reach out via Instagram or
          Email, and we will quickly arrange your payment through PayPal or
          Payoneer. We usually reply within a few hours to finalize your handmade
          order.
        </p>
        <div className="modal-contacts">
          <a href={`mailto:${CONTACT_EMAIL}`} className="modal-contact-link">
            <MailIcon className="modal-contact-icon" />
            {CONTACT_EMAIL_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="modal-contact-link">
            <InstagramIcon className="modal-contact-icon" />
            {INSTAGRAM_HANDLE}
          </a>
        </div>
      </Modal>
    </main>
  );
}

export default ProductPage;
