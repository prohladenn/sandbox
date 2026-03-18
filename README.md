# 🌍 Country Tracker — Telegram Mini App

A Telegram Mini App that lets you track countries you've visited, with an interactive world map, searchable country list, and statistics.

## Features

- **🗺️ Interactive World Map** — Tap any country to mark it as visited (highlighted in blue). Supports pinch-to-zoom and pan.
- **🔍 Country List** — Search and filter all 180+ countries by name or region. Toggle visited status with one tap.
- **📊 Statistics** — See how many countries you've visited, your percentage of the world, and a breakdown by region with progress bars.
- **🎨 Telegram Theme Support** — Automatically adapts to Telegram's light/dark theme colors.
- **💾 Persistent Storage** — Your visited countries are saved to `localStorage` so they persist between sessions.

## Screenshots

![Country Tracker UI](https://github.com/user-attachments/assets/ec9852d7-3fe5-4cf2-b3ae-aad6355d7f53)

## Tech Stack

- **React 19** + **TypeScript** — UI framework
- **Vite** — Build tool
- **@telegram-apps/sdk-react** — Telegram Mini Apps SDK
- **react-simple-maps** — SVG world map rendering
- **world-atlas** (via CDN) — Country geography data (ISO 3166-1)

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

Build the app and host it on any static hosting (Vercel, Netlify, GitHub Pages, etc.). Then configure your Telegram Bot to use the hosted URL as the Mini App URL.
