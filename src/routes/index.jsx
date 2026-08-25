import { Route, Routes } from 'react-router-dom'
import AboutPage from '../pages/AboutPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.jsx'
import ProductPage from '../pages/ProductPage.jsx'
import ProductsPage from '../pages/ProductsPage.jsx'
import TermsPage from '../pages/TermsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    </Routes>
  )
}

export default AppRoutes
