import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AboutPage from '../pages/AboutPage.jsx'
import ContactPage from '../pages/ContactPage.jsx'
import HomePage from '../pages/HomePage.jsx'
import NotFoundPage from '../pages/NotFoundPage.jsx'
import { OrderCancelledPage, OrderSuccessPage } from '../pages/OrderResultPage.jsx'
import PrivacyPolicyPage from '../pages/PrivacyPolicyPage.jsx'
import ProductPage from '../pages/ProductPage.jsx'
import ProductsPage from '../pages/ProductsPage.jsx'
import TermsPage from '../pages/TermsPage.jsx'

// The checkout form is gone (both buy buttons go straight to the payment
// page); old links to it land on the product page.
function CheckoutRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/products/${slug}`} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/products/:slug" element={<ProductPage />} />
      <Route path="/checkout/success" element={<OrderSuccessPage />} />
      <Route path="/checkout/cancel" element={<OrderCancelledPage />} />
      <Route path="/checkout/:slug" element={<CheckoutRedirect />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default AppRoutes
