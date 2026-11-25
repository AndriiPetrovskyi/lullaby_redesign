"use client";

// The header menu: the word "Menu", from under which icons slide out one by
// one. The animation is all CSS (HeaderMenu.module.css); here we only keep
// whether the menu is open.

import { useState } from "react";
import Link from "next/link";
import { FlameIcon, HandIcon, MailIcon } from "./icons.jsx";
import styles from "./HeaderMenu.module.css";

// Left to right. `steps`: how far the icon sits from "Menu", where it slides
// out from and back under.
const links = [
  { href: "/products", label: "All scents", Icon: FlameIcon, steps: 3 },
  { href: "/about", label: "Our workshop", Icon: HandIcon, steps: 2 },
  { href: "/contact", label: "Contact us", Icon: MailIcon, steps: 1 },
];

function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={isOpen ? `${styles.menu} ${styles.open}` : styles.menu}>
      {/* inert: while closed, the hidden icons can't be tapped or tabbed to */}
      <nav id="header-menu" className={styles.links} inert={!isOpen}>
        {links.map(({ href, label, Icon, steps }) => (
          <Link
            key={href}
            href={href}
            className={styles.link}
            aria-label={label}
            data-tooltip={label}
            style={{ "--steps": steps }}
            onClick={() => setIsOpen(false)}>
            <Icon />
          </Link>
        ))}
      </nav>

      <button
        type="button"
        className={styles.button}
        aria-expanded={isOpen}
        aria-controls="header-menu"
        onClick={() => setIsOpen(!isOpen)}>
        Menu
      </button>
    </div>
  );
}

export default HeaderMenu;
