# Project: Country Tracker — Agent Reference

This document gives a complete, authoritative description of the project so that
any agent can start working immediately without having to re-explore the codebase.

---

## 1. What the app does

**Country Tracker** is a Telegram Mini App that lets users mark countries they have
visited on an interactive world map.  Key features:

| Feature | Details |
|---|---|
| Interactive SVG world map | Tap a country to select it; pinch/scroll to zoom (1 × – 6 ×) |
| Country card | Persistent card pinned above the tab bar shows the selected country with flag, name, region and a "Mark Visited" / "Visited ✓" toggle |
| Countries list | Searchable, filterable (by region and visited/unvisited) list of all 195 countries |
| Statistics | Visited count, percentage of the world, and a per-region progress bar breakdown |
| Persistence | Visited set is stored in `localStorage` under the key `visited_countries` |
| Telegram theming | Reads Telegram WebApp theme params; falls back to system dark/light preference |

---

## 2. Tech stack

| Concern | Library / Tool |
|---|---|
| Framework | React 18 + TypeScript |
| Build tool | Vite 8 (base path `/sandbox/`) |
| Map | react-simple-maps 3 (SVG, `geoNaturalEarth1` projection) |
| Map data | World Atlas 2 via CDN: `https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json` (TopoJSON) |
| Telegram SDK | `@telegram-apps/sdk-react` (present as dep, theming via `window.Telegram.WebApp`) |
| Linter | ESLint 9 + typescript-eslint + react-hooks + react-refresh plugins |

---

## 3. Directory structure

```
sandbox/
├── AGENTS.md               ← this file
├── index.html
├── vite.config.ts          ← base: '/sandbox/'
├── tsconfig.app.json / tsconfig.node.json / tsconfig.json
├── eslint.config.js
├── package.json
└── src/
    ├── main.tsx            ← entry point; mounts <App> inside <ErrorBoundary>
    ├── App.tsx             ← root component; tab routing + global state
    ├── App.css / index.css ← minimal global styles (slideUp keyframe in App.css)
    ├── components/
    │   ├── WorldMap.tsx        ← SVG map with zoom/pan
    │   ├── CountryCard.tsx     ← selected-country card (pinned above tab bar)
    │   ├── CountrySearch.tsx   ← searchable/filterable country list
    │   ├── Statistics.tsx      ← visit counts and per-region progress bars
    │   ├── CountryToast.tsx    ← legacy auto-dismiss toast (unused in App, kept for reference)
    │   └── ErrorBoundary.tsx   ← class component error boundary wrapping the whole app
    ├── data/
    │   ├── countries.ts        ← 195 Country records + REGIONS array + TOTAL_COUNTRIES constant
    │   └── isoMapping.ts       ← NUMERIC_TO_ALPHA3: TopoJSON numeric ID → ISO 3166-1 alpha-3
    ├── hooks/
    │   └── useTelegramTheme.ts ← returns a TelegramTheme object (colors, map colors)
    └── store/
        └── useVisitedCountries.ts ← visited Set<string> state + localStorage sync
```

---

## 4. Key components

### `App.tsx`
- Manages `activeTab: "map" | "list" | "stats"` and `selectedCountry: string` (alpha-3 code, randomly initialised).
- Layout (top to bottom): **header** → **content area** (flex: 1) → **CountryCard** (map tab only) → **bottom tab bar**.
- `CountryCard` sits *outside* the scrollable content area so it is always pinned just above the tab bar.
- No toast is shown on country tap; `CountryToast` is not rendered.

### `WorldMap.tsx`
Props: `visitedCodes`, `selectedCountry?`, `onCountryClick(alpha3)`, `visitedColor`, `defaultColor`, `strokeColor`, `selectedColor`.

- Renders `ComposableMap` → `ZoomableGroup` (minZoom 1, maxZoom 6, `translateExtent [[0,0],[800,600]]` prevents panning outside the map bounds) → `Geographies` → `Geography`.
- Per-country fill priority: **visited** (`visitedColor`) › **selected** (`selectedColor`) › **default** (`defaultColor`); stored in `baseFill` and reused for both `default` and `hover` states (hover only differs by `opacity: 0.85`).
- Country identification: `geo.id` (numeric string) → `NUMERIC_TO_ALPHA3[id]` → alpha-3.

### `CountryCard.tsx`
Props: `alpha3`, `isVisited`, `onToggle(alpha3)`, `themeColor`, `textColor`, `bgColor`, `hintColor`.

Looks up country in `COUNTRIES`, renders flag emoji (36 px), name, region, and a toggle button.  Button is filled solid when unvisited and filled with 13 % opacity + tinted text when visited.

### `CountrySearch.tsx`
Local state: `search` (text), `regionFilter` ("All" or region name), `showVisited` ("all" | "visited" | "unvisited").  Clicking a row calls `onToggle`.

### `Statistics.tsx`
Derived from `visited` set via `useMemo`.  Shows total count, percentage, and per-region `count/total` progress bars.

### `CountryToast.tsx`
Legacy component — auto-dismiss floating toast (4 s), positioned above the tab bar with fixed positioning.  **Currently not used in `App.tsx`** but kept in the codebase.

### `ErrorBoundary.tsx`
Standard React class-based error boundary wrapping the whole app in `main.tsx`.

---

## 5. Data models

```typescript
// src/data/countries.ts
interface Country {
  code: string;   // ISO 3166-1 alpha-3  e.g. "USA"
  iso2: string;   // ISO 3166-1 alpha-2  e.g. "US"
  name: string;   // display name
  region: string; // one of the 6 regions below
  flag: string;   // Unicode emoji flag
}

// Regions (6 total, sorted):
// "Africa" | "Asia" | "Europe" | "North America" | "Oceania" | "South America"

// TOTAL_COUNTRIES = 195
```

```typescript
// src/data/isoMapping.ts
const NUMERIC_TO_ALPHA3: Record<string, string>
// maps TopoJSON numeric country IDs → alpha-3 codes
// e.g. { "840": "USA", "276": "DEU", ... }
```

---

## 6. Theme system (`useTelegramTheme`)

Returns a `TelegramTheme` object with these keys:

| Key | Usage |
|---|---|
| `bg` | Page background |
| `text` | Primary text |
| `hint` | Secondary / muted text |
| `accent` | Visited country fill, active tab, buttons |
| `card` | Card/list-item background |
| `header` | Top header + tab bar background |
| `separator` | Divider lines |
| `input` | Search input background |
| `mapDefault` | Unvisited, unselected country fill |
| `mapHover` | (retained in theme; not currently passed to WorldMap) |
| `mapStroke` | Country border stroke |
| `mapSelected` | Selected-but-not-visited country fill (muted blue) |

Light fallbacks: `accent #007aff`, `mapDefault #d1d1d6`, `mapSelected #a8c4e0`.  
Dark fallbacks: `accent #2196f3`, `mapDefault #3a3a3c`, `mapSelected #4a7bb5`.

---

## 7. State management

```
useVisitedCountries()  →  { visited: Set<string>, toggle(code), isVisited(code) }
  - localStorage key: "visited_countries"  (JSON array of alpha-3 codes)
  - toggle creates a new Set (immutable update) so React detects the change
```

All other state is local to components (`useState`).

---

## 8. Build, lint and dev commands

```bash
npm install          # install all deps (node_modules excluded from git)
npm run dev          # Vite dev server with HMR  (default port 5173)
npm run build        # tsc -b && vite build  →  dist/
npm run lint         # ESLint across the whole src tree
npm run preview      # serve the production dist/ locally
```

The build output goes to `dist/` at base path `/sandbox/`.  The `dist/` folder is
**not** committed (add to `.gitignore` if missing).

---

## 9. Conventions & patterns

- **No CSS modules or styled-components** — all styles are inline `React.CSSProperties` objects, computed in each component.
- **No global state library** — all state is React `useState` + custom hooks.
- **Country codes are always alpha-3** throughout the app (the map library, `COUNTRIES`, `visited` Set all use alpha-3).  `iso2` is stored in `countries.ts` but is not currently used anywhere.
- New map colours should be added to `TelegramTheme` in `useTelegramTheme.ts` first, then passed as props to `WorldMap`.
- Components never import from sibling components; they only import from `data/`, `hooks/`, `store/`, or React itself.
- `CountryToast.tsx` is dead code and can be deleted or repurposed when building new features.
