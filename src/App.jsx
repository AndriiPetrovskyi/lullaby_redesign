import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import { useIsMobile } from './hooks/useIsMobile.js'
import MobileFooter from './mobile/components/Footer.jsx'
import MobileNavbar from './mobile/components/Navbar.jsx'
import AppRoutes from './routes/index.jsx'

function App() {
  const isMobile = useIsMobile()

  return (
    <>
      <ScrollToTop />
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <AppRoutes />
      {isMobile ? <MobileFooter /> : <Footer />}
    </>
  )
}

export default App
