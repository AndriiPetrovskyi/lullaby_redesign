import Link from "next/link";
import HeaderMenu from "./HeaderMenu.jsx";
import styles from "./Header.module.css";

function Header() {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.logo}>
        Lullaby<span className={styles.logoAccent}>Rituals</span>
      </Link>

      <HeaderMenu />
    </header>
  );
}

export default Header;
