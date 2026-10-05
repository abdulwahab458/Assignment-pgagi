# Personalized Content Dashboard

A Next.js dashboard that aggregates **news** (NewsAPI), **movie recommendations** (TMDB), and **social posts** (mock API) into one personalized feed with search, favorites, drag-and-drop reordering, and dark mode.

## Features

- **Personalized feed** driven by category preferences (Settings)
- **RTK Query** for async API loading with infinite scroll / load more
- **Debounced search** across news, movies, and social content
- **Trending** and **Favorites** sections
- **Drag-and-drop** feed ordering (`@dnd-kit`)
- **Redux Toolkit + redux-persist** (preferences, UI, favorites)
- **Dark mode** via CSS custom properties + Tailwind
- **Framer Motion** transitions and loading states
- **Unit / integration tests** (Vitest) and **E2E** (Playwright)

## Prerequisites

- Node.js 20+
- npm

## Setup

```bash
git clone <your-repo-url>
cd pgagi
npm install
cp .env.example .env.local
```

Optional API keys in `.env.local` (the app uses **mock data** when keys are omitted):

| Variable        | Service   | Get a key                          |
|----------------|-----------|-------------------------------------|
| `NEWS_API_KEY` | NewsAPI   | https://newsapi.org/register        |
| `TMDB_API_KEY` | TMDB v3   | https://www.themoviedb.org/settings/api |

Keys are only read on the **server** in `/api/*` routes — never exposed to the browser.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## Testing

```bash
# Unit + integration (Vitest)
npm test

# E2E (starts dev server automatically)
npm run test:e2e
```

## Project structure

```
src/
  app/api/          # BFF routes (news, movies, social, search)
  components/       # UI, layout, sections
  store/            # Redux slices + RTK Query API
  lib/              # API clients, mocks, utilities
  types/            # Shared TypeScript types
e2e/                # Playwright specs
```

## Architecture notes

- **State**: `preferences`, `favorites`, and `ui` (dark mode, navigation, feed order, search) persist in `localStorage` via redux-persist.
- **Data**: Client calls `/api/feed`, `/api/trending`, and `/api/search`; routes call external APIs or fall back to mocks.
- **Social**: Mock hashtag feed — swap `src/lib/api/social.ts` for a real provider when credentials are available.

## License

MIT (assignment submission — adjust as needed).
