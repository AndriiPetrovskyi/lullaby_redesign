import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css'
import App from './App.jsx'

// react-helmet-async only ever appends its managed tags to <head> — it has
// no way to know about (and won't remove) the static SEO defaults baked
// into index.html for no-JS crawlers. Strip them the moment JS takes over,
// before Helmet renders anything, so JS-executing clients only ever see
// one, route-correct copy of each tag. See index.html for the other half.
document.querySelectorAll('[data-seo-default]').forEach((el) => el.remove())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
)
