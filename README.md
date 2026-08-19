# NewsPortal — Frontend

React + Vite frontend for NewsPortal. Lets users browse news by category, manage a personal profile, and (for admins) manage users and categories and view analytics through a dedicated admin dashboard.

## Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** react-router
- **State:** Redux Toolkit (`react-redux`)
- **Styling:** Tailwind CSS
- **HTTP:** axios (and native `fetch` for auth calls)
- **Icons:** lucide-react
- **Notifications (UI toasts):** react-toastify

## Prerequisites

- Node.js (v18+ recommended)
- The backend API running (locally or deployed) — see the backend README

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create a `.env` file** in the project root:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   ```
   Point this at your backend's base URL. In production this should be your deployed backend's URL (e.g. the Render deployment).

3. **Run the dev server**
   ```bash
   npm run dev
   ```
   The app runs on `http://localhost:5173` by default.

4. **Build for production**
   ```bash
   npm run build
   npm run preview   # preview the production build locally
   ```

## Project Structure

```
src/
├── components/
│   ├── admin/       # AdminSidebar, AdminNavbar, StatCard, etc.
│   ├── common/       # NavBar and other shared UI
│   ├── home/         # Home page components
│   └── profile/      # Profile-related components
├── pages/
│   ├── Auth/         # Login, Register, ForgotPassword, ResetPassword
│   ├── Home/          # Public home page
│   ├── admin/         # AdminDashboard, Users, AdminCategories, AdminAnalytics
│   └── user/           # Regular user dashboard
├── redux/
│   ├── store.js       # Redux store config
│   └── authSlice.js   # Auth state: user, isAuthenticated
├── router/
│   ├── ProtectedRoute.jsx   # Requires isAuthenticated
│   ├── GuestRoute.jsx        # Requires NOT authenticated (redirects logged-in users away from /login)
│   └── AdminRoute.jsx        # Requires isAuthenticated + role === "admin"
├── services/          # API call wrappers (authServices, adminService, etc.)
├── instances/          # Configured axios instances
└── App.jsx             # Route definitions
```

## Authentication Model

- Auth is **cookie-based**: the backend sets an httpOnly JWT cookie on login. The frontend never handles a raw token string — all authenticated requests must be sent with `withCredentials: true` (axios) or `credentials: "include"` (fetch).
- `authSlice.js` persists `user` (not a token) to `localStorage` so a page refresh doesn't immediately log the user out, and derives `isAuthenticated` from whether a user object is present.
- Because the cookie itself expires (currently 1 hour, matching the backend JWT), a stale local session can still *look* logged in in the UI even after the cookie has expired server-side — any authenticated API call in that state will fail with 401, at which point the app should clear local state and redirect to `/login`.

## Route Guards

| Guard | Behavior |
|---|---|
| `GuestRoute` | Used on `/login`, `/register`, etc. If already authenticated, redirects to `/admin` (admins) or `/home` (everyone else) instead of showing the form. |
| `ProtectedRoute` | Used on regular authenticated pages (`/home`, `/dashboard`, `/profile`). Redirects to `/login` if not authenticated. |
| `AdminRoute` | Used on `/admin/*`. Redirects to `/home` unless authenticated **and** `user.role === "admin"`. |

## Admin Dashboard

Accessible at `/admin` for accounts with `role: "admin"`:

- **Dashboard** — platform-wide stats (users, news, categories)
- **Users** — search, view, block/unblock, delete users
- **Categories** — add, edit, delete news categories
- **Analytics** — registration trend and category subscription breakdown

> Note: Accounts are only granted `role: "admin"` if explicitly set that way at registration (via the backend) or updated directly in the database — there's no self-serve way to become an admin through the UI.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api/v1` |

## Known Gotchas

- Since the backend never returns a token in the JSON response body (cookie-only auth), any service file expecting `response.data.token` will always get `undefined` — this is expected, not a bug.
- Some service files (e.g. `adminService.js`) call the backend with a hardcoded production URL rather than `VITE_API_BASE_URL`. If you're testing against a local backend, double-check which base URL each service file actually uses.