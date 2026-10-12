import { Route, Routes } from 'react-router-dom'
import AboutPage from '../pages/AboutPage.jsx'
import CheckoutPage from '../pages/CheckoutPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { OrderCancelledPage, OrderSuccessPage } from '../pages/OrderResultPage.jsx'
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
