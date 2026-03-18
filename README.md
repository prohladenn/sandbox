# 🌍 Country Tracker — Telegram Mini App

A Telegram Mini App that lets you track countries you've visited, with an interactive world map, searchable country list, and statistics.

**🔗 Live demo:** https://prohladenn.github.io/sandbox/

## Features

- **🗺️ Interactive World Map** — Tap any country to mark it as visited (highlighted in blue). Supports pinch-to-zoom and pan.
- **🔍 Country List** — Search and filter all 180+ countries by name or region. Toggle visited status with one tap.
- **📊 Statistics** — See how many countries you've visited, your percentage of the world, and a breakdown by region with progress bars.
- **🎨 Telegram Theme Support** — Automatically adapts to Telegram's light/dark theme colors.
- **💾 Persistent Storage** — Your visited countries are saved to `localStorage` so they persist between sessions.

## Screenshots

![Country Tracker UI](https://github.com/user-attachments/assets/ec9852d7-3fe5-4cf2-b3ae-aad6355d7f53)

## Tech Stack

- **React 18** + **TypeScript** — UI framework
- **Vite** — Build tool
- **[@telegram-apps/sdk-react](https://github.com/Telegram-Mini-Apps/telegram-apps)** — Telegram Mini Apps SDK
- **[@telegram-apps/telegram-ui](https://github.com/telegram-mini-apps-dev/TelegramUI)** — Telegram-styled UI component library
- **[reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template)** — Reference template for React-based Telegram Mini Apps
- **react-simple-maps** — SVG world map rendering
- **world-atlas** (via CDN) — Country geography data (ISO 3166-1)

## Libraries

### [@telegram-apps/sdk-react](https://github.com/Telegram-Mini-Apps/telegram-apps)

The [`telegram-apps`](https://github.com/Telegram-Mini-Apps/telegram-apps) monorepo provides the official Telegram Mini Apps SDK. This project uses the `@telegram-apps/sdk-react` package.

**How it is used:**

- **`isTMA()`** — Detects whether the app is running inside the Telegram client. Used in `main.tsx` to conditionally initialize the SDK only when inside Telegram, so the app also works as a standalone web page during development.
- **`init()`** — Initializes the Telegram Mini Apps SDK, enabling access to the Telegram WebApp API (theme parameters, viewport, back button, etc.).

```ts
// src/main.tsx
import { init, isTMA } from '@telegram-apps/sdk-react'

if (isTMA()) {
  try {
    init()
  } catch {
    // SDK init failed even inside Telegram — continue without it
  }
}
```

After initialization, `window.Telegram.WebApp` becomes available. The `useTelegramTheme` hook (`src/hooks/useTelegramTheme.ts`) reads `themeParams` and `colorScheme` from it to adapt the app's colors to the user's current Telegram theme (light or dark).

### [@telegram-apps/telegram-ui](https://github.com/telegram-mini-apps-dev/TelegramUI)

[TelegramUI](https://github.com/telegram-mini-apps-dev/TelegramUI) is a React component library that provides ready-made UI components matching Telegram's native look and feel (cells, sections, modals, tab bars, etc.).

**How it is used:**

The current UI is built with custom inline styles that follow Telegram's design language using theme colors from the SDK. TelegramUI is the recommended library for adopting Telegram's native component patterns — its components, design tokens, and layout conventions informed the structure of this app's tab navigation, card-style panels, and theme-aware color system.

### [reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template)

The [reactjs-template](https://github.com/Telegram-Mini-Apps/reactjs-template) is the official React + TypeScript + Vite starter for Telegram Mini Apps maintained by the Telegram Mini Apps team.

**How it is used:**

This project's setup is based on the patterns established in that template:

- **SDK initialization** — The `isTMA()` + `init()` pattern in `main.tsx` mirrors the template's entry point.
- **Vite + TypeScript** — Same build toolchain and `tsconfig` structure.
- **ErrorBoundary** — Wraps the root component to gracefully handle runtime errors, following the template's recommended structure.
- **GitHub Pages deployment** — The `.github/workflows/deploy.yml` workflow follows the same CI/CD approach shown in the template.

## Project Structure

```
src/
├── components/
│   ├── WorldMap.tsx        # Interactive SVG world map
│   ├── CountrySearch.tsx   # Searchable/filterable country list
│   ├── Statistics.tsx      # Stats panel with region breakdown
│   └── CountryToast.tsx    # Popup when tapping a country on map
├── data/
│   ├── countries.ts        # Country list with flags, regions, ISO codes
│   └── isoMapping.ts       # ISO numeric ↔ alpha-3 code mapping
├── hooks/
│   └── useTelegramTheme.ts # Telegram theme color extraction
├── store/
│   └── useVisitedCountries.ts  # State + localStorage persistence
├── App.tsx                 # Main app with tab navigation
└── main.tsx                # Entry point with Telegram SDK init
```

## Development

```bash
npm install
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview production build
```

## Deployment

### GitHub Pages (automated)

The app is automatically deployed to **https://prohladenn.github.io/sandbox/** on every push to `main` via the `.github/workflows/deploy.yml` GitHub Actions workflow.

To enable it in your fork:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow will build and deploy automatically

### Other hosting

Build with `npm run build` and deploy the `dist/` folder to any static host (Vercel, Netlify, etc.). Update `base` in `vite.config.ts` if serving from a subpath other than `/sandbox/`.
