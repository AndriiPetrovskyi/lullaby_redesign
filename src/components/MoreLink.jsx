// A link styled "Text ——": the text and a thin line to its right.
// `className` lets a section change its spacing.
import Link from "next/link";
import styles from "./MoreLink.module.css";

function MoreLink({ href, children, className = "" }) {
  return (
    <Link href={href} className={`${styles.link} ${className}`}>
      {children}
    </Link>
  );
}

export default MoreLink;
