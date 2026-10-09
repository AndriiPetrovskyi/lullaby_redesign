import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./Modal.css";

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

function Modal({ isOpen, onClose, children, labelledBy }) {
  const cardRef = useRef(null);
  // Callers pass inline arrows; reading it through a ref keeps the effect
  // below from re-running (and re-grabbing focus) on every parent render.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusFirst = requestAnimationFrame(() => {
      const card = cardRef.current;
      const first = card?.querySelector(
        `${FOCUSABLE.split(", ").map((s) => `${s}:not(.modal-close)`).join(", ")}`,
      );
      (first ?? card)?.focus();
    });

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      // keep Tab focus inside the dialog
      if (event.key !== "Tab" || !cardRef.current) return;
      const items = [...cardRef.current.querySelectorAll(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      cancelAnimationFrame(focusFirst);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus?.();
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}>
          <motion.div
            ref={cardRef}
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              aria-label="Close"
              onClick={onClose}>
              ×
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
