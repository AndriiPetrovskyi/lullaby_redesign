"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// A link that knows whether it points at the current page, for menus.
// `className` may be a function of { isActive }; `end` matches the path
// exactly (for "/"), otherwise sub-pages count as active too.
function NavLink({ to, end = false, className, children, ...props }) {
  const pathname = usePathname();
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);
  const resolvedClassName = typeof className === "function" ? className({ isActive }) : className;
  return (
    <Link href={to} className={resolvedClassName} aria-current={isActive ? "page" : undefined} {...props}>
      {children}
    </Link>
  );
}

export default NavLink;
