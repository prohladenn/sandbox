import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {
  init,
  isTMA,
  postEvent,
  mountViewport,
  expandViewport,
  requestFullscreen,
  mountSwipeBehavior,
  disableVerticalSwipes,
  mountBackButton,
} from '@telegram-apps/sdk-react'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

try {
  if (isTMA()) {
    init()
    postEvent('web_app_ready')

    // Expand the viewport to full height and request fullscreen if supported
    if (mountViewport.isAvailable()) {
      mountViewport().then(() => {
        if (expandViewport.isAvailable()) expandViewport()
        if (requestFullscreen.isAvailable()) requestFullscreen().catch(() => {})
      }).catch(() => {})
    }

    // Disable vertical swipes to prevent accidental app closure while scrolling
    if (mountSwipeBehavior.isAvailable()) {
      mountSwipeBehavior()
      if (disableVerticalSwipes.isAvailable()) disableVerticalSwipes()
    }

    // Mount the back button so components can show/hide it as needed
    if (mountBackButton.isAvailable()) {
      mountBackButton()
    }
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
