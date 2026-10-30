import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveSiteUrl } from './scripts/site-url.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const siteUrl = resolveSiteUrl(mode)

  return {
    plugins: [
      react(),
      {
        name: 'inject-site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl),
    },
  }
})
