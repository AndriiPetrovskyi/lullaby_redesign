import { Route, Routes } from 'react-router-dom'
import AboutPage from '../views/AboutPage.jsx'
import CheckoutPage from '../views/CheckoutPage.jsx'
import ContactPage from '../views/ContactPage.jsx'
import HomePage from '../views/HomePage.jsx'
import NotFoundPage from '../views/NotFoundPage.jsx'
import { OrderCancelledPage, OrderSuccessPage } from '../views/OrderResultPage.jsx'
import PrivacyPolicyPage from '../views/PrivacyPolicyPage.jsx'
import ProductPage from '../views/ProductPage.jsx'
import ProductsPage from '../views/ProductsPage.jsx'
import TermsPage from '../views/TermsPage.jsx'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />
      <Route path="/checkout/cancel" element={<OrderCancelledPage />} />
      <Route path="/checkout/:slug" element={<CheckoutPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
