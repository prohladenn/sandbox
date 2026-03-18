import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init, isTMA } from '@telegram-apps/sdk-react'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

try {
  if (isTMA()) {
    init()
  }
} catch {
  // Not in Telegram environment or SDK init failed — continue without it
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
