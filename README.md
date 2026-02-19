# Movie Recs V1

A V1 movie recommendation website built with Next.js.

## Frontend Preview

![Movie Recs V1 Frontend](./public/frontend-preview.png)

### Latest UI (V1+ Enhancements)

![Movie Recs V1 Plus Frontend](./public/frontend-preview-v2.png)

### IMDb-Inspired UX Refresh

![Movie Recs V1 IMDb-Inspired UI](./public/frontend-preview-v3.png)

### A Good Movie To Watch–Inspired Warm Editorial Refresh

![Movie Recs V1 Warm Editorial UI](./public/frontend-preview-v4.png)

## What it does (V1+)

- Lets users choose favorite genres
- Lets users set a minimum TMDB rating threshold
- Fetches candidate and upcoming movies from TMDB
- Ranks recommendations with a simple explainable scoring model
- Shows "Why recommended" and top cast on each movie card
- Supports side-by-side movie compare view (up to 3 titles from recommendations/watchlist)
- Adds upcoming radar filtering windows (30 / 90 / 180 days)
- Builds an actor connection graph with grouped strongest co-star links
- Includes a fun facts panel and a movie knowledge quiz

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- TMDB API

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file:

```bash
cp .env.example .env.local
```

3. Add TMDB auth to `.env.local` (v4 read token preferred):

```bash
TMDB_API_READ_ACCESS_TOKEN=...
# or legacy key
TMDB_API_KEY=...
```

4. Run dev server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API Routes

- `GET /api/search?q=...` → movie search (TMDB)
- `POST /api/recommend` → recommendations + actor network metadata
- `POST /api/upcoming` → upcoming titles by preferred genres + timeframe filter

`POST /api/recommend` body:

```json
{
  "favoriteGenres": [878, 53],
  "minVoteAverage": 6.5
}
```

`POST /api/upcoming` body:

```json
{
  "favoriteGenres": [878, 53],
  "timeframeDays": 90
}
```

Allowed `timeframeDays` values: `30`, `90`, `180`.

## Notes on IMDb / Rotten Tomatoes

For production use, confirm licensing/usage terms before scraping or redistributing Rotten Tomatoes/IMDb data.
Recommended production-safe approach:

- TMDB for metadata/discovery/posters
- OMDb (licensed/API-based) for IMDb rating fields
- Optional provider partnerships for broader review text rights

## Recent Product Updates

- Added persistent local watchlist (saved in browser localStorage)
- Added “Surprise Me” taste button for quick discovery
- Added stale-filter indicator when settings change and refresh is needed
- Added upcoming movie discovery by preferred genres
- Added actor relationship mapping from recommendation cast overlap
- Added fun facts and interactive movie quiz sections
- Added updated frontend screenshot assets in `/public`
- Added IMDb-inspired visual refresh: gold accent CTAs, glass cards, improved hierarchy, and hover polish
- Added warm editorial UX refresh inspired by A Good Movie To Watch (light palette, softer cards, human-friendly tone)
- Added compare view for research workflows (up to 3 movies, with rating/release/overview/cast preview)
- Added upcoming radar window filters in API + UI (30/90/180 day horizon)
- Improved actor network readability by grouping strongest co-star links by anchor actor

## Next Steps (V2)

- User auth + persistent profiles
- Like/dislike feedback loop
- Collaborative filtering
- Streaming provider availability
- Rich review sentiment scoring
