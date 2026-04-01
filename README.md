# Diskus — Enterprise Governance & Collaboration Platform

Diskus is a feature-rich React web application for managing meetings, committees, resolutions, minutes, documents, and organizational governance workflows.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture Overview](#architecture-overview)
- [Modules](#modules)
- [Documentation](#documentation)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.2 (Create React App + Craco) |
| State Management | Redux Toolkit + Redux Thunk |
| Routing | React Router v6 |
| UI Libraries | Ant Design 4, Bootstrap 5, Flowbite, Mobiscroll |
| Forms | React Hook Form, React Quill (rich text) |
| Charts | Recharts, React Google Charts |
| Document Viewer | PDFTron WebViewer (Apryse) |
| Real-time | Socket.io (port 9999), MQTT (port 8228) |
| Cross-tab Sync | Broadcast Channel API |
| Internationalization | i18next (English, Arabic, French, Japanese) |
| HTTP Client | Axios |
| Auth | Google OAuth 2.0, Microsoft OAuth 2.0 |

---

## Project Structure

```
Diskus-Main/
├── public/
│   ├── locales/              # i18n translation files (en, ar, fr, ja)
│   ├── webviewer/            # PDFTron WebViewer static assets
│   └── assets/               # Static font icons and images
├── src/
│   ├── index.js              # React root — Redux + all Context providers
│   ├── App.js                # Root component — routing, version polling, session sync
│   ├── i18n.js               # i18next configuration
│   ├── routes/               # React Router route definitions
│   │   ├── routes.js         # All application routes (100+)
│   │   ├── private_routes.js # Auth guard for user routes
│   │   └── privateadmin_routes.js # Auth guard for admin routes
│   ├── store/                # Redux state management
│   │   ├── store.js          # Configured store with 50+ reducers
│   │   ├── action_types.js   # Action type constants
│   │   ├── actions/          # Redux thunk action creators
│   │   └── reducers/         # State reducers
│   ├── context/              # React Context providers (11 contexts)
│   ├── container/            # Page-level feature containers (40+ modules)
│   ├── components/
│   │   ├── elements/         # Reusable low-level UI components
│   │   └── layout/           # Layout components (header, sidebar, navbar, talk)
│   ├── commen/
│   │   ├── apis/             # Axios instances & API endpoint definitions
│   │   └── functions/        # Shared utility functions
│   ├── hooks/                # Custom React hooks
│   └── assets/               # Images, fonts, icons
├── .env                      # Environment variables (see below)
├── craco.config.js           # Webpack overrides (stream polyfill, ESLint)
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 16
- npm >= 8
- Access to the backend microservices (see [Environment Variables](#environment-variables))

### Installation

```bash
git clone <repo-url>
cd Diskus-Main
npm install
```

### Running Locally

```bash
npm start
```

Opens at `http://localhost:3000`. The app proxies API calls to the base URL configured in `.env`.

---

## Environment Variables

Copy `.env.example` to `.env` and fill in values. Key variables:

| Variable | Description |
|----------|-------------|
| `REACT_APP_BASE_URL` | Base URL for all backend microservices (e.g. `http://192.168.18.x`) |
| `REACT_APP_ENV` | Environment (`dev` / `prod`) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `REACT_APP_APRYSEKEY` | PDFTron/Apryse WebViewer license key |
| `REACT_APP_MQTT` | MQTT broker host |
| `REACT_APP_MQTT_PORT` | MQTT broker port (default `8228`) |
| `REACT_APP_SOCKET_API` | Socket.io port (default `:9999`) |
| `REACT_APP_AUTH_API` | Auth service endpoint (`:11001/ERM_Auth`) |
| `REACT_APP_MEETING_API` | Meeting service endpoint (`:11002/Meeting`) |
| `REACT_APP_COMPLIANCE_MODULE` | Enable compliance module (`TRUE`/`FALSE`) |

See `.env` for the full list of service ports and endpoints.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server |
| `npm run build` | Production build to `/build` |
| `npm test` | Run test suite in watch mode |
| `npm run eject` | Eject from CRA (irreversible) |

---

## Architecture Overview

Diskus follows a layered architecture:

```
┌─────────────────────────────────────────┐
│              React UI Layer             │
│  containers/ + components/              │
├─────────────────────────────────────────┤
│           State Layer                   │
│  Redux Store (50+ reducers)             │
│  React Context (11 providers)           │
├─────────────────────────────────────────┤
│           Service Layer                 │
│  Axios API clients (commen/apis/)       │
│  Socket.io + MQTT (real-time)           │
├─────────────────────────────────────────┤
│         Backend Microservices           │
│  11+ services on ports 11001–11024      │
└─────────────────────────────────────────┘
```

The app bootstraps in `src/index.js`, wrapping the entire tree in:
1. `GoogleOAuthProvider` — Google login
2. Redux `Provider` — global state
3. 10 Context providers — domain-specific state (Auth, Talk, Meeting, Groups, Committee, Dataroom, Polls, Notes, Resolution, Compliance)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for a detailed breakdown.

---

## Modules

| Module | Route | Description |
|--------|-------|-------------|
| Dashboard | `/Diskus/` | Main home dashboard |
| Meetings | `/Diskus/Meeting` | Schedule, view, and manage meetings |
| Minutes | `/Diskus/Minutes` | Meeting minutes creation workflow |
| Video Conference | `/Diskus/video` | WebRTC-based video meetings |
| Calendar | `/Diskus/calendar` | Calendar view and sync |
| To-Do List | `/Diskus/todolist` | Personal task management |
| Notes | `/Diskus/notes` | Collaborative notes |
| Groups | `/Diskus/groups` | Group management |
| Committees | `/Diskus/committee` | Committee management |
| Resolutions | `/Diskus/resolution` | Resolution tracking |
| Data Room | `/Diskus/dataroom` | Document storage with e-signature |
| Polling | `/Diskus/polling` | Polls and voting |
| Compliance | `/Diskus/compliance` | Compliance management |
| Settings | `/Diskus/setting` | User-level settings |
| Admin | `/Admin/` | Organization admin panel |

See [`docs/MODULES.md`](docs/MODULES.md) for per-module details.

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture and data flow |
| [`docs/SETUP.md`](docs/SETUP.md) | Detailed setup and development guide |
| [`docs/MODULES.md`](docs/MODULES.md) | Feature module documentation |
| [`docs/REDUX.md`](docs/REDUX.md) | Redux store structure and usage |
| [`docs/ROUTING.md`](docs/ROUTING.md) | Route structure and auth guards |
| [`docs/API.md`](docs/API.md) | Backend API reference |
| [`docs/CONTEXTS.md`](docs/CONTEXTS.md) | React Context providers guide |
| [`docs/I18N.md`](docs/I18N.md) | Internationalization guide |
