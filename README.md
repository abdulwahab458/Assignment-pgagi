<div align="center">

# Personalized Content Dashboard

**Live news and movie recommendations in one interactive, personalized dashboard.**

Next.js 16 · React 19 · TypeScript · Redux Toolkit · Tailwind CSS v4

[Features](#features) · [Tech stack](#tech-stack) · [Getting started](#getting-started) · [Scripts](#scripts) · [Architecture](#architecture) · [API](#api) · [Testing](#testing) · [Configuration](#configuration) · [Project structure](#project-structure)

</div>

---

## About

A single-page dashboard that merges two live third-party data sources into one personalized feed:

- **News** — [NewsAPI](https://newsapi.org) (`/v2/everything`)
- **Movies** — [TMDB](https://www.themoviedb.org) (`/3/discover`, `/3/search`)

Users shape the feed around their interests, search across both providers, save favorites, re-order cards by drag-and-drop, and switch between light and dark themes. All state persists in the browser.

External API keys are read **only on the server** inside Next.js route handlers and never reach the browser bundle.

> 📘 Looking for a deep technical reference — every module, data flow, and design trade-off?
> See **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)**.

---

## Features

| Feature | Details |
| --- | --- |
| **Personalized feed** | Driven by category preferences set in Settings (at least one is always selected) |
| **Live data** | Real NewsAPI and TMDB responses with server-side ISR caching — 5 min for news, 1 hour for movies |
| **BFF layer** | Three Next.js route handlers normalise both providers into one `ContentItem` shape and hide API keys |
| **Partial-failure tolerance** | `Promise.allSettled` — one provider failing degrades the feed instead of breaking it; 502 only when all fail |
| **Infinite scroll** | Passive scroll listener auto-loads the next page 400px before the bottom, plus an explicit *Load more* button |
| **Debounced search** | 400ms debounce across both providers; queries under 2 characters issue no request |
| **Trending** | Top 12 items across all categories, ranked by `trendingScore` |
| **Favorites** | Full items persisted to `localStorage`; live count badge in the sidebar |
| **Drag-and-drop** | Reorder feed cards with pointer **or** keyboard (`@dnd-kit`), persisted across reloads |
| **Dark mode** | Seven CSS custom properties + one `class` toggle — no React re-render |
| **Persistence** | `redux-persist` saves preferences, favorites, and UI state |
| **Responsive** | Sidebar becomes a horizontal scroller on mobile; grids reflow 1 → 2 → 3 columns |
| **Animations** | `framer-motion` section transitions, card layout/reorder, infinite spinner |
| **Accessible** | Semantic landmarks, `aria-pressed` / `aria-current` / `aria-live`, `sr-only` labels, keyboard DnD, focus rings |
| **Tested** | Vitest unit + integration, Playwright E2E |

---

## Tech stack

### Framework

| Package | Version | Role |
| --- | --- | --- |
| `next` | `16.3.8` *(pinned)* | App Router, route handlers, ISR, `next/font`, `next/image` |
| `react` / `react-dom` | `19.2.8` *(pinned)* | React 19 |
| `typescript` | `^5` | Strict-mode types |

### State & data

| Package | Version | Role |
| --- | --- | --- |
| `@reduxjs/toolkit` | `^2.13.0` | Store, slices, RTK Query |
| `react-redux` | `^9.3.0` | Provider and typed hooks |
| `redux-persist` | `^6.0.0` | `localStorage` persistence |

### Interaction & motion

| Package | Version | Role |
| --- | --- | --- |
| `@dnd-kit/core` | `^6.3.1` | Drag sensors, collision detection |
| `@dnd-kit/sortable` | `^10.0.0` | Grid reordering, keyboard coordinates |
| `@dnd-kit/utilities` | `^3.2.2` | CSS transform conversion |
| `framer-motion` | `^14.0.0` | Transitions, layout animation, spinner |

### Styling & testing

| Package | Version | Role |
| --- | --- | --- |
| `tailwindcss` | `^4` | CSS-first config (no JS config file) |
| `@tailwindcss/postcss` | `^4` | PostCSS plugin |
| `vitest` | `^2.1.9` | Unit + integration runner (jsdom) |
| `@vitejs/plugin-react` | `^4.7.0` | JSX transform for Vitest |
| `jsdom` | `^29.1.1` | DOM environment |
| `@testing-library/react` | `^16.3.3` | Component rendering |
| `@testing-library/dom` | `^10.4.2` | Queries |
| `@testing-library/jest-dom` | `^7.0.1` | Custom matchers |
| `@testing-library/user-event` | `^14.6.7` | Installed, not yet used |
| `@playwright/test` | `^1.63.0` | Chromium E2E |
| `eslint` | `^9` | Flat-config linting |
| `eslint-config-next` | `16.3.8` *(pinned)* | `core-web-vitals` + TypeScript rules |

**Not used:** no database, no auth library, no schema validator, no component library, no icon package (unicode glyphs instead), no date library, no mocking library, no CI.

---

## Getting started

### Prerequisites

- **Node.js 20+**
- **npm**
- A **NewsAPI** key — https://newsapi.org/register
- A **TMDB v3 API key** — https://www.themoviedb.org/settings/api

Both are free. NewsAPI's free tier is developer-mode and may rate-limit or expire results.

### Install

```bash
git clone <your-repo-url>
cd pgagi
npm install
```

### Configure environment

```bash
cp .env.example .env.local
```

```bash
# .env.local
NEWS_API_KEY=your_newsapi_key
TMDB_API_KEY=your_tmdb_v3_api_key
```

| Variable | Service | Where to get it |
| --- | --- | --- |
| `NEWS_API_KEY` | NewsAPI | https://newsapi.org/register |
| `TMDB_API_KEY` | TMDB v3 | https://www.themoviedb.org/settings/api |

> 🔒 Both keys are read exclusively in `src/lib/api/*.ts`, which are imported only by server route handlers. There is no `NEXT_PUBLIC_*` usage. `.env*` is gitignored — **never commit `.env`**.

### Run

```bash
npm run dev
```

Open **http://localhost:3000**.

### Production build

```bash
npm run build
npm start
```

### Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| "Could not load feed" on every section | Missing or invalid keys | Verify `.env.local` and restart the dev server |
| Only news cards, no movies | TMDB failing, NewsAPI healthy | Check `TMDB_API_KEY`; partial failure is by design |
| Only movies, no news | NewsAPI failing, TMDB healthy | Check `NEWS_API_KEY` and your NewsAPI quota |
| "Could not search content" | Both search providers down | Verify both keys |
| Rate-limited or empty results | NewsAPI free-tier limits | Wait, or upgrade the plan |
| Theme resets after reload | `PersistGate` / storage cleared | Clear-site-data can wipe `localStorage` |

---

## Scripts

| Script | Command | Description |
| --- | --- | --- |
| `npm run dev` | `next dev` | Development server with HMR |
| `npm run build` | `next build` | Production build |
| `npm start` | `next start` | Serve the production build |
| `npm run lint` | `eslint` | Lint (flat config) |
| `npm test` | `vitest run` | Unit + integration, single pass |
| `npm run test:watch` | `vitest` | Watch mode |
| `npm run test:e2e` | `playwright test` | E2E suite (auto-starts dev server) |

Full verification loop:

```bash
npm run lint && npx tsc --noEmit && npm test
```

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│  Browser                                                       │
│                                                               │
│  page.tsx → DashboardShell                                    │
│    ├── ThemeSync         toggle `dark` on <html>              │
│    ├── Sidebar           dispatch setActiveSection             │
│    ├── Header            dark toggle · SearchBar · avatar     │
│    └── main → AnimatePresence mode="wait"                     │
│              └── Feed | Trending | Favorites | Settings       │
│                    └── DraggableFeedGrid → SortableCard       │
│                          └── ContentCard                      │
└───────────────────────────────────────────────────────────────┘
        │  RTK Query hooks                    ▲  redux-persist
        ▼                                      │  (localStorage)
┌───────────────────────────────────────────────────────────────┐
│  Redux Toolkit store                                           │
│    preferences · favorites · ui       (persisted)             │
│    contentApi (RTK Query cache)         (memory only)         │
└───────────────────────────────────────────────────────────────┘
        │  fetchBaseQuery { baseUrl: "/api" }
        ▼
┌───────────────────────────────────────────────────────────────┐
│  Next.js route handlers (BFF — the only place keys exist)      │
│    /api/feed · /api/trending · /api/search                    │
│    Promise.allSettled · ISR (news 300s / TMDB 3600s)           │
└───────────────────────────────────────────────────────────────┘
        │
        ▼
   NewsAPI  ·  TMDB
        │  normalise → ContentItem
        │  ids: news-<fnv1a-base36>  ·  tmdb-<id>
        ▼
   ContentItem[] → ContentCard
```

### Design decisions

- **Single route, tab navigation.** There is one Next.js route (`/`). Section switching is a Redux state change resolved by `AnimatePresence` — not by routing. No dynamic segments, no URL-backed state.
- **BFF, not direct client calls.** Route handlers hide the API keys, normalise provider payloads once, cache with ISR, and coordinate partial failure.
- **Stable IDs.** NewsAPI has no article ID, so articles get `news-<FNV-1a hash of URL>`; TMDB movies use their real numeric ID. This is what lets favorites and drag-order survive pagination and refetches.
- **Order stored as IDs.** `ui.feedOrder` holds ids only. `DraggableFeedGrid` reconciles saved ids against current items — known ids in saved order, unknown dropped, new appended. Order therefore survives infinite scroll.
- **Theming is pure CSS.** Seven custom properties redefined under `.dark`, consumed via Tailwind arbitrary values (`bg-[var(--surface)]`). No component carries a `dark:` colour branch.
- **API cache is never persisted.** `contentApi` is excluded from the redux-persist whitelist so stale content cannot reappear after a reload.

### Data flow

**Feed** — `FeedSection` reads `preferences.categories` and local `page` state → `useGetFeedPageQuery` → `GET /api/feed` → `Promise.allSettled` over NewsAPI (`ceil(pageSize/2)` articles) and TMDB (page 1 only) → results concatenated and sliced to `pageSize`. RTK Query's `merge` replaces the cache on page 1 and appends afterwards.

**Infinite scroll** — a `window` scroll listener calls `loadMore()` within 400px of the bottom, guarded by `!isFetching && hasMore`. `forceRefetch` guarantees a real request when the page or categories change. Changing categories resets to page 1.

**Search** — every keystroke updates `ui.searchQuery` (keeps the input responsive and persisted); `useDebouncedValue(query, 400)` delays what is actually requested. Under 2 characters the query is `skip`ped. `FeedSection` swaps the draggable grid for a plain list and the heading to "Search results". Both providers are searched **directly** — this is not a client-side filter of the loaded feed. `SearchBar` and `FeedSection` issue identical queries, so RTK Query de-duplicates them.

**Favorites** — the whole `ContentItem` is stored, not just the `id`, so the Favorites section renders full cards without refetching.

**Dark mode** — `ThemeSync` renders `null` and only toggles the `dark` class on `document.documentElement`. One class flip repaints the whole app.

---

## API

All endpoints are `GET`, live under `/api`, and return normalised `ContentItem` objects.

### `GET /api/feed`

| Param | Type | Default | Notes |
| --- | --- | --- | --- |
| `categories` | comma-separated | `technology,entertainment` | Validated against `CONTENT_CATEGORIES`; falls back to defaults when empty/invalid |
| `page` | integer | `1` | Clamped to `>= 1` |
| `pageSize` | integer | `6` | Clamped to `1…20` |

```jsonc
// 200
{
  "items": [ /* ContentItem[] */ ],
  "hasMore": true,
  "page": 1
}

// 502 — every provider failed
{
  "items": [],
  "hasMore": false,
  "page": 1,
  "error": "Live content providers are unavailable."
}
```

Movies are fetched only on `page === 1`, so infinite scroll never re-queries TMDB.

### `GET /api/trending`

No parameters. Fetches 8 news articles across all categories plus 6 movies, merges them, sorts by `trendingScore` descending, returns the top **12**. Returns `502` only when both providers reject.

### `GET /api/search?q=<term>`

`q` shorter than 2 characters returns `200 []` with no provider calls. Otherwise searches both providers (12 news by relevancy, 12 movies) and returns `[...news, ...movies].slice(0, 24)`. Returns `502 { error: "Live search providers are unavailable." }` only when both reject.

### Error semantics

> If at least one provider succeeds, return whatever arrived — possibly partial. If **every** provider fails, return `502`.

Clients surface this via `EmptyState` with actionable copy ("Check your connection or API keys in `.env.local`").

### `ContentItem`

```ts
interface ContentItem {
  id: string;             // "news-<fnv1a>" | "tmdb-<id>"
  source: "news" | "movie";
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  category?: string;
  publishedAt?: string;   // stored, currently not rendered
  trendingScore?: number;
}
```

### Provider mappings

**Categories → NewsAPI search terms**

| Category | Term |
| --- | --- |
| `technology` | `technology` |
| `sports` | `sports` |
| `finance` | `business` |
| `entertainment` | `entertainment` |
| `science` | `science` |

Multiple terms are OR-joined: `(technology OR entertainment)`.

**Categories → TMDB genres**

| Category | Genre id |
| --- | --- |
| `technology` | 878 |
| `entertainment` | 28 |
| `science` | 878 |
| `sports` | *(unmapped)* |
| `finance` | *(unmapped)* |

Only the **first** mapped genre is used for discovery, so the default selection always requests 878.

---

## Testing

### Unit & integration — Vitest

jsdom environment, setup file loads `@testing-library/jest-dom/vitest`, `@` aliased to `./src`.

```bash
npm test
```

| Spec | Verifies |
| --- | --- |
| `src/lib/debounce.test.ts` | `debounce` defers via fake timers |
| `src/store/slices/favoritesSlice.test.ts` | `toggleFavorite` adds then removes |
| `src/store/slices/preferencesSlice.test.ts` | Category toggle keeps ≥1 selected; `setCategories([])` falls back to defaults |
| `src/components/sections/FavoritesSection.test.tsx` | Renders the empty state through a real store + `Provider` |

### End-to-end — Playwright

Chromium only, `baseURL: http://localhost:3000`, auto-starts `npm run dev` (120s timeout). CI-aware: `forbidOnly` and 2 retries under `CI`, reuses a local dev server otherwise.

```bash
npm run test:e2e
```

| Test | Asserts |
| --- | --- |
| `loads feed and navigates sections` | "Your feed" → Trending → Settings headings |
| `debounced search shows results section` | Filling the searchbox reveals "Search results" |
| `dark mode toggle updates html class` | `html` gains the `dark` class |
| `drag handle reorders feed cards` | Dragging handle 0 onto handle 1 changes the first card title |
| `favorite flow` | Favouriting then navigating to Favorites shows a "Favorited" button |

Tests locate elements by **role and accessible name**, which works because of the accessibility work described below.

### Known issues

- **`test-results/` is git-tracked.** Playwright artifacts are committed; `.gitignore` should list `/test-results/` and `/playwright-report/`.
- **The drag-reorder test has a committed failure artifact** from the mock-data era. The archived snapshot shows a dnd-kit self-drop (`dropped over droppable area mock-news-tech-1`), which `handleDragEnd` correctly treats as a no-op. Increase `steps` and pause after `mouse.down` if it proves flaky locally.
- **Coverage gaps:** no tests for `contentApi` (the `merge` / `serializeQueryArgs` / `forceRefetch` logic), the route handlers, the provider mapping functions, `useDebouncedValue`, `DraggableFeedGrid`, `SettingsPanel`, `SearchBar`, `Header`, `Sidebar`, `ThemeSync`, or `uiSlice`. No `msw` or `vi.mock`, so nothing network-touching is covered.
- **`renderWithProviders` in `src/test-utils/` is unused** — `FavoritesSection.test.tsx` inlines its own `Provider`. Same for `@testing-library/user-event`.

---

## Configuration

### `next.config.ts`

```ts
const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "image.tmdb.org" }],
  },
};
```

Only TMDB images are allowlisted for `next/image` optimisation. NewsAPI images render with `unoptimized`, sidestepping the allowlist.

### TypeScript

Strict mode, `noEmit`, `isolatedModules`, `moduleResolution: "bundler"`, target `ES2017`, and the alias `"@/*" → "./src/*"`.

Test files, `e2e/`, `vitest.config.ts`, and `playwright.config.ts` are **excluded** from the Next build type-check and validated by their own runners.

### ESLint

Flat config spreading `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`, overriding the inherited ignores (`.next/**`, `out/**`, `build/**`, `next-env.d.ts`).

### Tailwind CSS v4

No `tailwind.config.js`. Everything lives in `src/app/globals.css` via `@import "tailwindcss"` and `@theme inline`.

### Theme tokens

```css
:root {
  --background: #f4f6fb;   --foreground: #0f172a;
  --surface: #ffffff;      --surface-elevated: #eef2ff;
  --border: #e2e8f0;       --muted: #64748b;
  --accent: #4f46e5;
}
.dark {
  --background: #0b1020;   --foreground: #e2e8f0;
  --surface: #121a2e;      --surface-elevated: #1a2540;
  --border: #2a3550;       --muted: #94a3b8;
  --accent: #818cf8;
}
```

Consume them with Tailwind arbitrary values — `bg-[var(--surface)]`, `text-[var(--muted)]`, `border-[var(--border)]` — **not** `dark:` variants. That is what makes theming a single class toggle.

### Fonts

`Geist` and `Geist_Mono` are self-hosted at build time via `next/font/google` and exposed as `--font-geist-sans` / `--font-geist-mono`. No runtime font request.

### Version pinning

`next`, `react`, `react-dom`, and `eslint-config-next` are pinned to exact versions because they must stay in lockstep. Everything else uses caret ranges.

---

## Project structure

```
pgagi/
├── .env.example              # Template + key registration links
├── AGENTS.md                 # Next.js agent rules (regenerated by next dev)
├── README.md
├── PROJECT_OVERVIEW.md       # Deep technical reference
├── eslint.config.mjs         # Flat config
├── next.config.ts
├── playwright.config.ts
├── postcss.config.mjs
├── tsconfig.json
├── vitest.config.ts
├── vitest.setup.ts
├── e2e/
│   └── dashboard.spec.ts     # 5 Playwright tests
├── public/                   # 5 unused Create-Next-App SVGs
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout, fonts, metadata, StoreProvider
│   │   ├── page.tsx          # Renders <DashboardShell />
│   │   ├── globals.css       # Tailwind import, theme tokens, .sr-only
│   │   ├── favicon.ico
│   │   └── api/
│   │       ├── feed/route.ts       # Paginated personalised feed
│   │       ├── search/route.ts     # Debounced dual-provider search
│   │       └── trending/route.ts   # Ranked top 12
│   ├── components/
│   │   ├── content/ContentCard.tsx      # Reusable card
│   │   ├── dashboard/DashboardShell.tsx # Composition root
│   │   ├── feed/DraggableFeedGrid.tsx   # DndContext + SortableCard
│   │   ├── layout/
│   │   │   ├── Header.tsx              # Greeting, SearchBar, dark toggle, avatar
│   │   │   ├── SearchBar.tsx           # Debounced controlled input
│   │   │   └── Sidebar.tsx             # Nav + favourites badge
│   │   ├── providers/
│   │   │   ├── StoreProvider.tsx       # Store + PersistGate
│   │   │   └── ThemeSync.tsx           # Toggles `dark` on <html>
│   │   ├── sections/
│   │   │   ├── FeedSection.tsx         # Largest component
│   │   │   ├── FavoritesSection.tsx
│   │   │   ├── FavoritesSection.test.tsx
│   │   │   ├── SettingsPanel.tsx       # Name + category chips
│   │   │   └── TrendingSection.tsx
│   │   └── ui/
│   │       ├── EmptyState.tsx
│   │       └── LoadingSpinner.tsx
│   ├── hooks/useDebouncedValue.ts
│   ├── lib/
│   │   ├── api/
│   │   │   ├── movies.ts          # TMDB client + normaliser
│   │   │   └── news.ts             # NewsAPI client + normaliser
│   │   ├── debounce.ts            # Standalone debouncer (unused)
│   │   └── debounce.test.ts
│   ├── store/
│   │   ├── api/contentApi.ts      # RTK Query: getFeedPage/getTrending/searchContent
│   │   ├── hooks.ts               # Typed useAppDispatch/useAppSelector/useAppStore
│   │   ├── slices/
│   │   │   ├── favoritesSlice.ts (+ .test.ts)
│   │   │   ├── preferencesSlice.ts (+ .test.ts)
│   │   │   └── uiSlice.ts
│   │   └── store.ts               # makeStore factory + persist config
│   ├── test-utils/renderWithProviders.tsx  # Unused helper
│   └── types/content.ts           # Domain types + CONTENT_CATEGORIES
└── test-results/                 # Playwright artifacts — tracked, should be ignored
```

---

## State model

### Store shape

```ts
combineReducers({
  preferences,          // persisted
  favorites,            // persisted
  ui,                   // persisted
  [contentApi.reducerPath]: contentApi.reducer,   // memory only
})
```

`persistConfig` uses key `"dashboard-root"` with `whitelist: ["preferences", "favorites", "ui"]`. `makeStore()` is a **factory**, so tests get isolated stores. `getDefaultMiddleware` ignores the six redux-persist action types for serialisability checks.

### `preferences`

| Field | Type | Default |
| --- | --- | --- |
| `categories` | `ContentCategory[]` | `["technology", "entertainment"]` |
| `userName` | `string` | `"Guest User"` |

`toggleCategory` · `setCategories` · `setUserName`

**Invariant:** removing the last category resets it to `[cat]` — at least one category is always selected. `setUserName` trims, and empty input reverts to `"Guest User"`.

### `favorites`

`items: ContentItem[]` (default `[]`). `toggleFavorite` removes by `id` if present, otherwise `unshift`s to the front. `removeFavorite` filters by `id`.

### `ui`

| Field | Type | Default |
| --- | --- | --- |
| `darkMode` | `boolean` | `false` |
| `activeSection` | `"feed" \| "trending" \| "favorites" \| "settings"` | `"feed"` |
| `feedOrder` | `string[]` | `[]` |
| `searchQuery` | `string` | `""` |

`setDarkMode` · `toggleDarkMode` · `setActiveSection` · `setFeedOrder` · `setSearchQuery`

### RTK Query endpoints

| Endpoint | Args | Returns | Behaviour |
| --- | --- | --- | --- |
| `getFeedPage` | `{ categories, page, pageSize? }` | `{ items, hasMore, page }` | `serializeQueryArgs` drops `page`; `merge` appends for `page > 1`; `forceRefetch` on page/category change |
| `getTrending` | `void` | `ContentItem[]` | — |
| `searchContent` | `{ q }` | `ContentItem[]` | Skipped under 2 characters |

Hooks: `useGetFeedPageQuery`, `useLazyGetFeedPageQuery`, `useGetTrendingQuery`, `useSearchContentQuery`.

### Persistence lifecycle

`StoreProvider` builds the store and persistor lazily inside `useRef`, then wraps children in `<Provider>` and `<PersistGate>`. The gate shows a "Loading dashboard…" screen until rehydration completes, preventing a flash of default state over saved preferences. `renderWithProviders` intentionally omits the gate.

---

## Accessibility

| Technique | Where |
| --- | --- |
| Semantic landmarks | `<header>`, `<aside>`, `<nav>`, `<main>`, `<article>`, `<section>` |
| `aria-labelledby` | Every `<section>` linked to its heading |
| `aria-current="page"` | Active sidebar nav item |
| `aria-pressed` | Dark toggle, favourite button, category chips |
| `aria-label` | Dark toggle (state-aware), drag handle |
| `aria-live` / `role="status"` | Spinner, search result count |
| `sr-only` | Search label, sidebar heading, result count |
| Native semantics | `<fieldset>` + `<legend>` for both Settings groups; `<ul>`/`<li>` grids with `list-none` |
| Keyboard DnD | `KeyboardSensor` + `sortableKeyboardCoordinates` |
| Focus rings | `focus:ring-2 ring-[var(--accent)]` |
| Decorative hiding | `aria-hidden` on icons, avatar, spinner, rank badges |
| Alt text | Card images use `alt=""` — the adjacent `<h3>` already conveys meaning |

Icons are unicode glyphs (`◎ ↑ ★ ☆ ⚙ ☾ ☀ ⋮⋮`), which keeps the bundle free of an icon dependency while staying readable to screen readers via adjacent text.

---

## Performance

| Decision | Rationale |
| --- | --- |
| News ISR `revalidate: 300` | News goes stale in minutes; 5 min keeps it fresh while cutting API calls |
| TMDB ISR `revalidate: 3600` | Posters and popularity change slowly |
| Movies fetched only on page 1 | Infinite scroll never re-queries TMDB |
| `serializeQueryArgs` drops `page` | All pages share one cache entry |
| `forceRefetch` on page/category change | Pagination must not be served from a stale slot |
| `contentApi` excluded from persistence | Stale content can never survive a reload |
| 400ms debounce + `<2` char skip | One request per pause, zero for single characters |
| Derived `isFavorite` selector | No separate membership set to keep in sync |
| `PersistGate` blocks first paint | No flash of default theme or categories |
| CSS-variable theming | Theme change = one class toggle, zero React renders |
| `layout` prop on cards | Drag displacement animates without manual math |

---

## Extending

### Add a category

1. Add the member to the `ContentCategory` union in `src/types/content.ts`.
2. Add it to the `CONTENT_CATEGORIES` array.
3. Add a `categoryToNewsQuery` entry in `src/lib/api/news.ts`.
4. Add a `genreMap` entry in `src/lib/api/movies.ts` if a TMDB genre fits.

### Add a content provider

1. Create `src/lib/api/<provider>.ts` with `fetch<Provider>` / `search<Provider>` and a `<Provider>Error` class. Read keys from `process.env` — never `NEXT_PUBLIC_*`.
2. Map results to `ContentItem` with a deterministic, prefixed, stable `id`.
3. Wire the functions into the existing `Promise.allSettled` fan-out.
4. Extend the "all providers failed" condition.
5. Add `sourceLabels` / `ctaLabels` entries in `ContentCard.tsx` and update the `ContentSource` union.

### Add a section

1. Add the id to `DashboardSection` in `src/types/content.ts`.
2. Create `components/sections/<Name>Section.tsx` as a `"use client"` component following the `motion.section` enter/exit pattern.
3. Add a nav entry to the `nav` array in `Sidebar.tsx`.
4. Add a branch to `DashboardShell.tsx`.

---

## Known issues

1. **`test-results/` is git-tracked** — Playwright artifacts are committed. Add `/test-results/` and `/playwright-report/` to `.gitignore`.
2. **Stale failing drag-reorder artifact** from the mock-data era — see [Testing](#known-issues).
3. **`.env` comment is stale** — it claims mock data is used when keys are missing. That stopped being true when `src/lib/mock-data.ts` was removed; the app now returns 502 provider errors. `.env.example` is correct.
4. **`publishedAt` is stored but never rendered** — no date library installed.
5. **`src/lib/debounce.ts` is dead code** — it has a passing test but no production import; the app uses `useDebouncedValue`.
6. **`onOrderChange` is redundant** — `DraggableFeedGrid` both calls the prop and dispatches `setFeedOrder` itself.
7. **`public/` assets are unused** — all five SVGs are untouched Create-Next-App scaffolding.
8. **Provider mapping limitations** — `fetchMovieRecommendations` uses only the *first* mapped genre, so `entertainment` never reaches TMDB discovery under the default selection; `science` and `technology` both map to genre 878; news items are all labelled with `categories[0]`.
9. **No CI** — no `.github/` workflow, though `playwright.config.ts` already reads `CI`.

---

## Notes for contributors

This project uses **Next.js 16.3.8**, which has breaking changes relative to earlier versions. `AGENTS.md` points to the version-specific documentation bundled with the package — **read the relevant guide before writing framework code**:

```
node_modules/next/dist/docs/
```

Resolve that path relative to `AGENTS.md`'s directory (in a monorepo the `next` package may not be visible from the repo root). Heed any deprecation notices. `AGENTS.md` is regenerated by `next dev`; removing the block only recreates the uncommitted change, so committing it alongside your work keeps the tree clean.

---

## License

MIT — adjust as needed for your submission terms.