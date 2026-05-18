# AI Candidate Shortlisting System

Full-stack MERN app: recruiters add candidates, match them against a job spec via a rules-based scorer, and get an AI-powered shortlist via OpenRouter.

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose), JWT auth, OpenRouter
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios, react-hot-toast

## Project Structure
```
backend/
  src/
    config/        # db connection
    middleware/    # auth middleware
    models/        # Mongoose schemas
    routes/        # Express routers
    controllers/   # request handlers
    services/      # matching + AI services
    utils/         # helpers
    server.js
  .env.example
  package.json

frontend/
  src/
    pages/         # Dashboard, AddCandidate, CandidateList, JobMatching, AIShortlist, Login, Register
    components/    # Navbar, CandidateCard, MatchBadge, Spinner, ProtectedRoute
    services/      # api.js (axios instance)
    hooks/         # useAuth, useCandidates
    context/       # AuthContext, ThemeContext
    App.jsx, main.jsx, index.css
  .env.example
  package.json
  tailwind.config.js
  vite.config.js
  index.html
```

## Setup

### 1. Backend
```bash
cd backend
cp .env.example .env
# Fill MONGO_URI, JWT_SECRET, OPENROUTER_API_KEY
npm install
npm run dev
```
Server runs on `http://localhost:5000`.

### 2. Frontend
```bash
cd frontend
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm install
npm run dev
```
App runs on `http://localhost:5173`.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-shortlist
JWT_SECRET=replace-with-long-random-string
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_MODEL=openai/gpt-4o-mini
CORS_ORIGIN=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## API

| Method | Endpoint                  | Auth | Body |
|--------|---------------------------|------|------|
| POST   | /api/auth/register        | no   | `{name,email,password}` |
| POST   | /api/auth/login           | no   | `{email,password}` |
| GET    | /api/auth/me              | yes  | — |
| POST   | /api/candidates           | yes  | `{name,email,skills,experience,bio}` |
| GET    | /api/candidates           | yes  | query: `search`, `skill`, `page`, `limit` |
| GET    | /api/candidates/:id       | yes  | — |
| PUT    | /api/candidates/:id       | yes  | partial candidate |
| DELETE | /api/candidates/:id       | yes  | — |
| POST   | /api/match                | yes  | `{requiredSkills,preferredSkills,minExperience}` |
| POST   | /api/ai/shortlist         | yes  | `{requiredSkills,preferredSkills,minExperience}` |

## Notes
- Default OpenRouter model: `openai/gpt-4o-mini` (configurable via `OPENROUTER_MODEL`).
- Skill matching is case-insensitive, trimmed.
- Candidates are scoped per recruiter (owner field).
