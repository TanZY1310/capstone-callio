# Demo Mode — Presentation Login

Two buttons ("Demo as Agent" / "Demo as Team Lead") on the login page let you bypass Firebase authentication and enter the app with pre-seeded demo data. Ideal for presentations, walkthroughs, and development testing.

## How to use

1. Start all three services as normal (backend, frontend, whatsapp-service).
2. Open the frontend at `http://localhost:5173`.
3. Click the **"Demo as Agent"** or **"Demo as Team Lead"** button on the login page.
4. You are instantly logged in and redirected to `/home` with demo data populated.

The session persists across page refreshes. To exit, click **Logout** in the sidebar — this clears the demo session and returns you to the login page.

---

## Files created / modified

### Backend (3 files)

| File | Change |
|---|---|
| `backend/core/demo.py` | **New.** In-memory demo session store. Defines realistic demo users: Amir Hassan (agent, also under team lead), Datin Seri Zara (team lead), and sub-agents Sarah Chen / James Lim. |
| `backend/seed_data.py` | **New.** Three distinct customer sets (21 total), one per user. Each set has 7 unique Malaysian customers with unique phone numbers, budgets, locations, and statuses. Also seeds speech analyses and objections. Idempotent — skips if customers already exist for that user. |
| `backend/routers/auth.py` | **Modified.** (1) `verify_firebase_token` accepts `DEMO_`-prefixed tokens; unrecognized demo tokens are rejected immediately (no fallthrough to Firebase). (2) `POST /auth/demo-login` — creates or finds demo users, seeds sub-agents (not the team lead), returns `{ demo_token, user }`. (3) Seeding uses deterministic agent ordering by email to guarantee correct customer sets. |

### Frontend (4 files)

| File | Change |
|---|---|
| `frontend/src/hooks/useAuth.js` | **Modified.** `loginDemo(role)` calls `POST /auth/demo-login`. Demo session restored from localStorage via lazy `useState` initializer. `logout()` clears demo storage when in demo mode. |
| `frontend/src/utils/api.js` | **Modified.** Request interceptor prefers `demo_token` over Firebase token. Response interceptor skips 401 retry in demo mode. |
| `frontend/src/components/Authentication/LoginForm.jsx` | **Modified.** Two daisyUI `btn-outline btn-accent` buttons: "Demo as Agent" and "Demo as Team Lead". |
| `frontend/src/App.jsx` | **Modified.** Passes `loginDemo` as `onDemoLogin` prop to the `<Login>` route. |

---

## Demo users

| Role | Name | Email | License | Branch |
|---|---|---|---|---|---|
| Agent (also under team lead) | Amir Hassan | amir.hassan@callio-property.com | REN12345 | Kuala Lumpur HQ |
| Team Lead | Datin Seri Zara | zara@callio-property.com | REN67890 | Kuala Lumpur HQ |
| Sub-agent 1 | Sarah Chen | sarah.chen@callio-property.com | — | Petaling Jaya Branch |
| Sub-agent 2 | James Lim | james.lim@callio-property.com | — | Cheras Branch |

---

## What gets seeded

### Agent demo (Amir Hassan)

| Entity | Count | Details |
|---|---|---|
| Customers | 7 | Set 0 — Tan Wei Ming, Nurul Huda, Lee Chong Wei, Priya Devi, Wong Kok Wai, Ahmad Faizal, Goh Siew Ling |
| Speech analyses | 3 | For first 3 customers — transcription, sentiment, next_actions, summary |
| Objections | 6 | 2 per speech analysis |

### Team Lead demo (Datin Seri Zara)

| Entity | Count | Details |
|---|---|---|
| Team lead user | 1 | Datin Seri Zara, role: `team_lead` |
| Sub-agents | 3 | Amir Hassan (Set 0), Sarah Chen (Set 1), James Lim (Set 2) |
| Customers per agent | 7 each | 21 total across all 3 sets |

All 21 customer phone numbers are unique Malaysian-format numbers (no collisions). Each user gets their own distinct set of customer names, ensuring realistic demo data across all views.

---

## Architecture walkthrough

```
User clicks "Demo as Agent"
  → LoginForm calls onDemoLogin('agent')
  → useAuth.loginDemo('agent')
    → POST /auth/demo-login { role: "agent" }
    → Backend:
        1. Finds or creates Amir Hassan in DB by email
        2. Calls seed_demo_data(db, user.user_id, set_index=0)
        3. Generates DEMO_<uuid> token, stores in _demo_sessions dict
        4. Returns { demo_token, user: { user_id, first_name, ... } }
    → Stores demo_token + userProfile in localStorage
    → Sets user + profile state; loading = false
  → App sees profile is truthy → ProtectedRoute renders <Sidebar><Outlet/>

User clicks "Demo as Team Lead"
  → Same flow, but role = "team_lead"
  → Backend creates Datin Seri Zara + finds/creates 3 sub-agents
  → Seeds Set 0 for Amir Hassan, Set 1 for Sarah Chen, Set 2 for James Lim
  → Team lead dashboard shows 3 agents with aggregate data

Subsequent API calls:
  → api.js interceptor reads localStorage('demo_token')
  → Attaches Authorization: Bearer DEMO_<uuid>
  → Backend verify_firebase_token():
      token starts with "DEMO_"
      → Valid session found → returns { uid, demo: true }
      → No session found → returns 401 (does NOT fall through to Firebase)
  → resolve_user_id(db, uid) finds demo user in PostgreSQL
  → Endpoint returns data for the demo user (customers, dashboard metrics, etc.)
```

---

## Idempotency & safety

- **Demo users are created once** — subsequent clicks find the existing DB row.
- **Seed data is inserted once** — `seed_demo_data()` checks if customers already exist for the user before inserting.
- **Amir Hassan is both a standalone agent AND a sub-agent** — he appears under the team lead when the team lead is created/updated. Customer sets are assigned deterministically by email, not DB query order.
- **Phone numbers are unique across all 3 sets** — no collision possible even if all demo users are created.
- **Expired demo tokens are rejected cleanly** — unrecognized `DEMO_` tokens return 401, never fall through to Firebase.
- **No environment variable guard** — the demo endpoint is always available. The app is not intended for production use where this would be a concern.
- **No impact on Firebase quota** — demo mode never calls Firebase Admin SDK for token verification.
