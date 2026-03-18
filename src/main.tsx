import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { init, postEvent } from '@telegram-apps/sdk-react'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

try {
  init()
  postEvent('web_app_ready')
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
