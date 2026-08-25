import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import navLinks from '../../data/navLinks.js'
import './Navbar.css'

const listVariants = {
  hidden: { clipPath: 'circle(0% at calc(100% - 32px) 32px)' },
  visible: {
    clipPath: 'circle(150% at calc(100% - 32px) 32px)',
    transition: { duration: 0.5, ease: [0.65, 0, 0.35, 1] },
  },
  exit: {
    clipPath: 'circle(0% at calc(100% - 32px) 32px)',
    transition: { duration: 0.4, ease: [0.65, 0, 0.35, 1] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.06, duration: 0.3 },
  }),
  exit: { opacity: 0, y: 16, transition: { duration: 0.15 } },
}

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="m-navbar">
      <button
        type="button"
        className={isOpen ? 'm-navbar-toggle m-navbar-toggle--open' : 'm-navbar-toggle'}
        aria-expanded={isOpen}
        aria-label="Меню"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span />
        <span />
        <span />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="m-navbar-list"
            variants={listVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {navLinks.map((link, i) => (
              <motion.li key={link.to} custom={i} variants={itemVariants}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    isActive ? 'm-navbar-link m-navbar-link--active' : 'm-navbar-link'
                  }
                  end={link.to === '/'}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </NavLink>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
