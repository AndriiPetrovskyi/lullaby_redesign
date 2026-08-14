import { NavLink } from 'react-router-dom'
import './Navbar.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About us' },
  { to: '/contact', label: 'Contact us' },
]

function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <ul className="navbar-list">
          {links.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? 'nav-item navbar-link navbar-link--active' : 'nav-item navbar-link'
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
