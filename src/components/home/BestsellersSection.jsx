// Home: bestsellers, three tiles in a row (photo, name, price), picked with
// the "Bestseller" switch in the admin. Without the backend, the block
// isn't shown at all rather than showing empty.
import Link from "next/link";
import LoadingImage from "../LoadingImage.jsx";
import { fetchBestsellers } from "../../lib/serverApi.js";
import styles from "./BestsellersSection.module.css";

async function BestsellersSection() {
  const bestsellers = await fetchBestsellers();
  if (bestsellers.length === 0) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Bestsellers</h2>

      <div className={styles.grid}>
        {bestsellers.map((candle) => (
          <Link key={candle.slug} href={`/products/${candle.slug}`} className={styles.card}>
            <LoadingImage
              src={candle.image}
              alt={`${candle.name} in a Lullaby gypsum vessel`}
              width={800}
              height={800}
              sizes="(max-width: 767px) 100vw, 400px"
              className={styles.photo}
            />
            <h3 className={styles.name}>{candle.name}</h3>
            <p className={styles.price}>${candle.price}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default BestsellersSection;
