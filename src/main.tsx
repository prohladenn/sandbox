import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init, isTMA } from '@telegram-apps/sdk-react'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

if (isTMA()) {
  try {
    init()
  } catch {
    // SDK init failed even inside Telegram — continue without it
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
