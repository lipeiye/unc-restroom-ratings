# UNC Restroom Ratings — Technical Reference

> One-page reference for any AI agent working on this project.

---

## Overview

A real-time restroom rating web app for UNC Chapel Hill. Users browse restrooms by building/floor, rate them with 1-5 stars, and trigger a "Red Alert" if someone didn't flush. All data resets daily at 6:00 AM.

**Current data scope:**
- Sitterson Hall — Floors 1F, 2F, 3F
- Davis Library — Floors 1F–8F
- Undergraduate Library — Floors 1F, 2F, 3F

Users can also submit new restrooms (any building + floor).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS + Socket.io-client |
| Backend | Node.js + Express + Socket.io |
| Database | MongoDB Atlas (primary) + SQLite (local fallback) + in-memory (last resort) |
| Maps | ~~Leaflet~~ (removed — list-only UI now) |
| Deployment | Docker + AWS Elastic Beanstalk (ready) |

---

## Directory Structure

```
unc-restroom-ratings/
├── client/                     # React frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navbar.jsx
│   │   │   ├── StarRating.jsx
│   │   │   └── ...
│   │   ├── pages/              # Route-level pages
│   │   │   ├── HomePage.jsx    # List view + Add Restroom form
│   │   │   └── RestroomDetail.jsx  # Rating + Red Alert button
│   │   ├── hooks/
│   │   │   └── useRestrooms.js # Main data hook (REST + Socket.io)
│   │   ├── data/
│   │   │   └── uncRestrooms.js # Seed data (14 restrooms)
│   │   └── utils/
│   │       └── dateFormat.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── server/                     # Express backend
│   ├── data/
│   │   ├── uncRestrooms.js     # Shared seed data
│   │   ├── memoryStore.js      # Pure in-memory fallback (last resort)
│   │   ├── sqliteStore.js      # SQLite CRUD wrapper
│   │   └── database.sqlite     # Local SQLite file (auto-created)
│   ├── config/
│   │   ├── db.js               # MongoDB connection + SQLite fallback
│   │   └── sqlite.js           # SQLite connection & schema init
│   ├── routes/
│   │   ├── restrooms.js        # GET / POST restrooms
│   │   └── reviews.js          # POST rating / no-flush alert
│   ├── config/
│   │   └── db.js               # MongoDB connection (falls back silently)
│   ├── models/                 # Mongoose schemas (used if MongoDB available)
│   │   ├── Restroom.js
│   │   └── Review.js
│   └── server.js               # Entry point + Socket.io + cron reset
├── Dockerfile
└── docker-compose.yml
```

---

## API Endpoints

### Restrooms

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/restrooms` | List all restrooms (sorted: redAlert first, then rating desc) |
| `GET` | `/api/restrooms/:id` | Get single restroom |
| `POST` | `/api/restrooms` | Create new restroom `{name?, building, floor, description?}` |
| `GET` | `/api/restrooms/meta/buildings` | Get unique building names |
| `GET` | `/api/restrooms/meta/last-reset` | Get last daily reset timestamp |

### Reviews / Ratings

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/reviews/rate/:restroomId` | Submit star rating `{rating: 1-5}` |
| `POST` | `/api/reviews/noflush/:restroomId` | Trigger "no flush" red alert |

### Socket.io Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `ratingUpdate` | Server → Client | `{ restroom }` — broadcast when rating/alert changes |
| `dataReset` | Server → Client | `{ resetAt }` — broadcast at 6:00 AM daily |

> **Dev proxy note:** Vite dev server proxies both `/api` and `/socket.io` to `localhost:5001`. The frontend uses relative paths (`/api/...`) so it works out of the box without `VITE_API_URL`.

---

## Data Model (In-Memory)

```js
Restroom {
  _id: string              // e.g. "r-1"
  name: string             // e.g. "Floor 2 Restroom"
  building: string         // e.g. "Sitterson Hall"
  floor: string            // e.g. "2F"
  description: string
  location: { lat, lng }
  averageRating: number    // 0–5, rounded to 1 decimal
  totalReviews: number     // count of ratings submitted
  pooperScore: number      // derived: averageRating * 0.9, capped at 5
  cleanliness: number      // derived: averageRating * 0.95, capped at 5
  redAlert: boolean        // true if flagged
  redAlertCount: number    // auto-increments on rating <= 2; triggers redAlert at >= 2
  noFlushCount: number     // increments when user clicks "No Flush" button
  lastUpdated: ISOString
  createdAt: ISOString
}
```

---

## Key Business Logic

### 1. Red Alert System
- **Auto-trigger:** Rating ≤ 2 stars increments `redAlertCount`. At count ≥ 2, `redAlert = true`.
- **Manual trigger:** User clicks "🚫🚽 Someone Didn't Flush! Red Alert" → `noFlushCount++`, `redAlert = true` immediately.
- **UI effect:** Red-alert restrooms are sorted to the very top of the list with red background/border.

### 2. Daily Reset (6:00 AM)
- Implemented via `node-cron` (`0 6 * * *`) + a custom `setTimeout` scheduler in `server.js`.
- Resets all data back to the 14 seed restrooms (clears all ratings, alerts, and user-added restrooms).
- Emits `dataReset` event to all connected clients.
- Countdown shown in UI updates every second.

### 3. Score Derivation
```
poooperScore    = min(5, round(averageRating * 0.9 * 10) / 10)
cleanliness     = min(5, round(averageRating * 0.95 * 10) / 10)
```

### 4. Database Fallback Chain
The backend tries databases in this order:

1. **MongoDB Atlas** — used if `MONGODB_URI` is set and connection succeeds.
2. **SQLite** — local file (`server/data/database.sqlite`) used when MongoDB is unavailable. Data persists across restarts. This is the default dev mode.
3. **In-memory** — pure RAM fallback if both above fail. Data is lost on restart.

All three layers expose identical CRUD behavior via `restrooms.js` / `reviews.js` routes.

---

## Frontend Pages

### HomePage (`/`)
- **Layout:** Building directory grid, max-width 1024px (`max-w-5xl`), responsive 2-column cards.
- **Stats row:** Buildings count, Restrooms count, Red Alerts count.
- **Search:** Filters by building name, floor label, or restroom name/description.
- **Red Alert section:** Buildings with any red-alert restrooms.
- **Normal section:** All other buildings, sorted by weighted average rating desc.
- **Building Card design:**
  - Building name: `text-2xl font-black tracking-tight` (most prominent)
  - Floor count + floor tags (chips)
  - Poopability + Cleanliness scores (weighted by review count)
  - Total rating: large number on the right
- **Add Restroom form:** Toggleable form at top. Fields: Building name (req), Floor (req), Name (opt), Description (opt).

### BuildingDetail (`/building/:buildingName`)
- **Header card:** Building name, floor count, restroom count, weighted average rating.
- **Summary grid:** Poopability, Cleanliness, Red Alerts, Reset Timer.
- **Floor cards:** Sorted by floor (B1, G, 1F, 2F...), each with scores and a "View details" link.
- **Red alert styling:** Red bg/border for flagged restrooms.

### RestroomDetail (`/restroom/:id`)
- Header card with building name, floor, average rating.
- Red alert banner if flagged.
- Two score cards: **Poopability** and **Cleanliness** with progress bars.
- Rating section: 🤢 Bad → 5 star buttons → 😍 Great.
- "No Flush" red button at bottom.
- Daily reset countdown.

---

## Development Setup

```bash
# 1. Start backend (required — frontend will be empty without it)
cd server
npm install
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
node server.js        # runs on :5001

# 2. Start frontend (new terminal)
cd client
npm install
export PATH="$HOME/.nvm/versions/node/v20.20.2/bin:$PATH"
npm run dev           # runs on :5173, proxies /api and /socket.io to :5001
```

No MongoDB required for local dev — SQLite activates automatically and persists data to `server/data/database.sqlite`.

> **Important:** The frontend needs the backend running to display restroom data. If you only see the header/search bar but no cards, the backend is not started.

---

## Environment Variables

Create `server/.env`:
```env
PORT=5001
MONGODB_URI=mongodb+srv://...   # optional; omit for SQLite fallback
CLIENT_URL=http://localhost:5173
SQLITE_PATH=./data/database.sqlite   # optional; defaults to server/data/database.sqlite
```

**Client-side (optional):**
`client/.env` is not required for local dev. The frontend uses relative API paths (`/api/...`) by default. Only set `VITE_API_URL` if you need to point the frontend at a different backend (e.g., production API).

---

## Deployment (AWS Elastic Beanstalk)

1. Create MongoDB Atlas cluster (free tier works).
2. Set `MONGODB_URI` in EB environment variables.
3. Deploy the Dockerfile — EB handles container build automatically.

---

## Common Modifications

| Want to change... | Edit this file |
|-------------------|----------------|
| Reset time | `server/server.js` — change `setHours(6, 0, 0, 0)` and cron pattern |
| Seed restrooms / buildings | `server/data/uncRestrooms.js` |
| Red alert threshold | `server/data/memoryStore.js` — `redAlertCount >= 2` |
| Score formulas | `server/data/memoryStore.js` or `sqliteStore.js` — `pooperScore` / `cleanliness` lines |
| SQLite schema / local DB | `server/config/sqlite.js` — table definitions |
| Card UI layout | `client/src/pages/HomePage.jsx` — `RestroomRow` component |
| Rating UI | `client/src/pages/RestroomDetail.jsx` — star buttons section |
| API base URL / proxy rules | `client/vite.config.js` — `server.proxy` section |
| Data fetching hook | `client/src/hooks/useRestrooms.js` — REST + Socket.io client |
| Add more API endpoints | `server/routes/` + register in `server.js` |

---

## GitHub Repository

https://github.com/lipeiye/unc-restroom-ratings
