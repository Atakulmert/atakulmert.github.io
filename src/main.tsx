import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

// GitHub Pages index.html'i 10 dk önbellekte tutuyor; güncellemeden sonra eski sürüm açılırsa bir kez yenile
if (import.meta.env.PROD) {
  fetch(`/version.txt?t=${Date.now()}`, { cache: 'no-store' })
    .then((r) => (r.ok ? r.text() : null))
    .then((latest) => {
      if (!latest || latest.trim() === __BUILD_ID__) return
      const key = `reloaded-for-${latest.trim()}`
      try {
        if (sessionStorage.getItem(key)) return
        sessionStorage.setItem(key, '1')
      } catch {
        return
      }
      location.reload()
    })
    .catch(() => {})
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
