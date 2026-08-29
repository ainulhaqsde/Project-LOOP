# LOOP — Final Frontend

Production-style frontend for **LOOP — AI Customer Feedback Intelligence Platform**.

This frontend follows the feature surfaces in the Zidio Project LOOP brief:
- Authentication / workspace entry
- Role-aware workspace UI (Admin / Analyst / Viewer)
- Feedback ingestion and inbox
- Search/filter/status workflow
- Dashboard analytics
- Theme clustering / trends
- Grounded Ask LOOP UI
- Voice-of-Customer reports
- Responsive UI
- Empty/loading/error-ready states
- Backend API integration layer

## Run in VS Code

### Option A — easiest
1. Open this folder in VS Code.
2. Install **Live Server**.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

### Option B — Python local server
From the project folder:
```bash
python -m http.server 5500
```
Open:
`http://localhost:5500`

## Project structure

```text
LOOP-Frontend-Final/
├── index.html
├── README.md
├── assets/
│   ├── style.css
│   ├── app.js
│   ├── data.js
│   └── api.js
└── pages/
    ├── dashboard.html
    ├── inbox.html
    ├── trends.html
    ├── ask.html
    ├── reports.html
    └── settings.html
```

## Backend handoff

The frontend has a central API client in `assets/api.js`.

Suggested backend routes to connect:

```text
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/me

GET    /api/feedback
POST   /api/feedback
POST   /api/feedback/import
PATCH  /api/feedback/:id

GET    /api/themes
GET    /api/themes/trends

POST   /api/insights/ask

POST   /api/reports
GET    /api/reports
GET    /api/reports/:id

GET    /api/workspace
GET    /api/workspace/members
POST   /api/workspace/members
PATCH  /api/workspace/members/:id
```

Change the API URL from **Settings → API connection**, or set:

```js
localStorage.setItem("LOOP_API_BASE_URL", "http://localhost:3000/api");
```

## Important architecture rule

The browser should call only your own API. The backend should:
1. authenticate the session;
2. verify the user's role;
3. scope every query to the authenticated `workspaceId`;
4. talk to PostgreSQL/Prisma;
5. call Claude only from the server;
6. perform retrieval before Ask LOOP answers;
7. return clean JSON to the frontend.

Never put `ANTHROPIC_API_KEY`, database credentials or authentication secrets in frontend files.

## Data

`assets/data.js` contains a small **seed-style frontend dataset** so the screens are fully populated while backend development is in progress. It is not intended to replace the PostgreSQL backend.

When the API is ready, replace page-level `LOOP_DATA` reads with API calls and keep the UI unchanged.

## Git workflow

Recommended:
```bash
git checkout -b feat/loop-frontend
git add .
git commit -m "feat: build LOOP customer intelligence frontend"
git push -u origin feat/loop-frontend
```

Then open a pull request into your team's main branch.

## Before submission

- Connect all API endpoints.
- Remove unused seed-data fallbacks if the team requires a backend-only data source.
- Test Admin / Analyst / Viewer permissions with real backend enforcement.
- Test CSV validation and feedback pagination.
- Test Ask LOOP grounding and source citations.
- Test VoC generation and export.
- Test loading, empty and error states.
- Run accessibility and responsive checks.
- Deploy frontend + backend.
- Prepare README, demo video and screenshots.
