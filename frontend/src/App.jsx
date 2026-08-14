import Navbar from './components/Navbar.jsx'
import { useIsMobile } from './hooks/useIsMobile.js'
import MobileNavbar from './mobile/components/Navbar.jsx'
import AppRoutes from './routes/index.jsx'

function App() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile ? <MobileNavbar /> : <Navbar />}
      <AppRoutes />
    </>
  )
}

export default App
