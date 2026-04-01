# Architecture Overview

## Application Bootstrap

The entry point is `src/index.js`. It creates two React roots:

1. **`#mainSpinner`** — renders the global loading spinner, connected to Redux so any part of the app can trigger it.
2. **`#root`** — the main application tree, wrapped in the full provider stack.

### Provider Stack (outer → inner)

```
GoogleOAuthProvider          ← Google OAuth client ID
  └── Provider (Redux)       ← global state store
        └── AuthProvider     ← authentication state & signOut helper
              └── TalkProvider        ← real-time messaging (Talk module)
                    └── MeetingProvider      ← meeting state
                          └── GroupsProvider
                                └── CommitteeProvider
                                      └── DataroomProvider
                                            └── PollsProvider
                                                  └── NotesProvider
                                                        └── ResolutionProvider
                                                              └── ComlianceProvider
                                                                    └── <App />
```

Order matters: `AuthProvider` is near the top because many downstream providers depend on the authenticated user.

---

## Top-Level Components

### `App.js`

Handles four cross-cutting concerns:

| Concern | Mechanism |
|---------|-----------|
| Routing | `<RouterProvider router={router} />` |
| Session sync | `visibilitychange` event — syncs `localStorage` ↔ `sessionStorage` on tab focus |
| Cross-tab logout | `BroadcastChannel("auth")` — logout in one tab propagates to all tabs |
| Version polling | Polls `/version.json` every 60 seconds; shows `UpdateVersionNotifyModal` when version changes |
| Mobile deep-link | Detects mobile user-agent; attempts to open `thediskus://` deep link and shows app-install modal on fallback |
| Payment modal | Conditionally renders `OpenPaymentForm` (iframe) based on Redux state |

---

## State Management

Diskus uses two parallel state systems:

### Redux (global, persistent across navigation)

- **50+ reducers** combined in `src/store/store.js`
- Middleware: Redux Thunk (async actions)
- DevTools: `redux-devtools-extension` (dev only)
- **Global reset**: dispatching `SET_INITIAL_ALLSTATE` sets `state = undefined`, effectively resetting all reducers to their initial values (used on logout)

### React Context (domain-specific, provider-scoped)

| Context | File | Purpose |
|---------|------|---------|
| `AuthContext` | `context/AuthContext.js` | Auth state, `signOut` helper |
| `TalkContext` | `context/TalkContext.js` | Messaging / chat state |
| `MeetingContext` | `context/MeetingContext.js` | Meeting UI state |
| `GroupsContext` | `context/GroupsContext.js` | Groups state |
| `CommitteeContext` | `context/CommitteeContext.js` | Committee state |
| `DataroomContext` | `context/DataroomContext.js` | Data room state |
| `PollsContext` | `context/PollsContext.js` | Polls state |
| `NotesContext` | `context/NotesContext.js` | Notes state |
| `ResolutionContext` | `context/ResolutionContext.js` | Resolution state |
| `ComplianceContext` | `context/ComplianceContext.js` | Compliance state |
| `AuthorityContext` | `context/AuthorityContext.js` | Admin authority/compliance (scoped to admin routes) |
| `NewMeetingContext` | `context/NewMeetingContext.js` | Scoped to the Meeting route only |

**When to use Context vs Redux:**
- Use **Redux** for data that needs to persist across route changes or be accessed by many unrelated components.
- Use **Context** for data tightly coupled to a specific feature tree (e.g., meeting editor state only needed within the meeting pages).

---

## Real-time Communication

Diskus uses three mechanisms for live data:

| Mechanism | Transport | Port | Used For |
|-----------|-----------|------|---------|
| Socket.io | WebSocket | 9999 | Real-time events (notifications, meeting updates) |
| MQTT | TCP/WebSocket | 8228 | Live presence, IoT-style push updates |
| BroadcastChannel | In-browser | — | Cross-tab state sync (logout, session sync) |

---

## Routing Architecture

All routes are defined in `src/routes/routes.js` using React Router v6 `createBrowserRouter`.

Three route categories:
- **Public routes** — accessible without authentication (`/`, `/Signup`, `/forgotpasswordVerification`, etc.)
- **Private user routes** — wrapped in `<PrivateRoutes />`, nested under `/Diskus/`
- **Private admin routes** — wrapped in `<PrivateAdminRoute />`, nested under `/Admin/`

All routes are wrapped in `<ErrorBoundary>` with a centralized `ErrorFallback` component and `logErrors` handler.

See [`ROUTING.md`](ROUTING.md) for the full route table.

---

## API Layer

All HTTP communication goes through Axios instances configured in `src/commen/apis/`.

Each microservice has its own base URL constructed from:
```
REACT_APP_BASE_URL + REACT_APP_<SERVICE>_API
```

Example:
```
http://192.168.18.x:11002/Meeting
```

See [`API.md`](API.md) for the full service reference.

---

## Build System

- **CRA** (Create React App) with **Craco** override (`craco.config.js`)
- Craco adds:
  - `stream-browserify` webpack fallback (required by some MQTT/crypto libraries)
  - ESLint plugin configuration
- Fonts: Montserrat (Latin) and IBM Plex Sans Arabic (RTL) loaded via `@fontsource` packages
- RTL support: separate `ar.css` stylesheet loaded at root level
