# Setup & Development Guide

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 16 |
| npm | >= 8 |
| Git | Any recent version |

---

## Installation

```bash
git clone <repo-url>
cd Diskus-Main
npm install
```

> `npm install` may take a few minutes — there are ~98 dependencies including the PDFTron WebViewer (~200MB in `public/webviewer/`).

---

## Environment Configuration

Create a `.env` file in the project root (copy from `.env.example` if available):

```bash
cp .env.example .env
```

### Required Variables

```env
# Base URL for all backend services
REACT_APP_BASE_URL=http://<backend-host>

# Environment: "dev" or "prod"
REACT_APP_ENV=dev

# Google OAuth (for Google login)
REACT_APP_GOOGLE_CLIENT_ID=<your-google-client-id>

# PDFTron/Apryse WebViewer license key
REACT_APP_APRYSEKEY=<your-apryse-key>

# MQTT broker
REACT_APP_MQTT=<mqtt-broker-host>
REACT_APP_MQTT_PORT=8228
REACT_APP_MQTT_LIVE_URL=<mqtt-live-url>
REACT_APP_MQTT_User=<base64-encoded-username>
REACT_APP_MQTT_Pass=<base64-encoded-password>

# Microsoft OAuth redirect URL
REACT_APP_MS_LOGIN_URL=<microsoft-oauth-url>

# Secret key used for local encryption
REACT_APP_SECERETKEY=DISKUS
```

### Microservice API Endpoints

These variables follow the pattern `REACT_APP_BASE_URL + port + path`:

```env
REACT_APP_AUTH_API=:11001/ERM_Auth
REACT_APP_MEETING_API=:11002/Meeting
REACT_APP_TODO_LIST_API=:11003/ToDoList
REACT_APP_SETTING_API=:11004/Settings
REACT_APP_ADMIN_API=:11009/Admin
REACT_APP_NOTES_API=:11011/Notes
REACT_APP_GROUPS_API=:11012/Groups
REACT_APP_COMMITTEE_API=:11013/Committee
REACT_APP_TALK_API=:11014/Talk
REACT_APP_RESOLUTION_API=:11015/Resolution
REACT_APP_CALENDAR_API=:11016/Calender
REACT_APP_DATA_ROOM_API=:11017/DataRoom
REACT_APP_POLL_API=:11018/Polls
REACT_APP_VIDEO_API=:11019/Video
REACT_APP_REPORT_DOWNLOAD_API=:11020/ExcelReport
REACT_APP_WORKFLOW_API=:11021/WorkFlow
REACT_APP_AUDIT_API=:11023/Audit
REACT_APP_COMPLIANCE_API=:11024/Compliance
REACT_APP_SOCKET_API=:9999

# Feature flags
REACT_APP_COMPLIANCE_MODULE=TRUE
```

---

## Running the App

### Development

```bash
npm start
```

- Opens at `http://localhost:3000`
- Hot reloads on file changes
- Proxies API calls based on `.env` configuration

### Production Build

```bash
npm run build
```

Output is in the `/build` folder. Serve it with any static file server or reverse proxy (nginx, Apache).

### Serve production build locally

```bash
npx serve -s build
```

---

## Development Tips

### Disable console in production

In `src/index.js`, there is a commented-out block that suppresses `console.log`, `console.error`, etc. in production. Uncomment it when deploying to `prod`:

```js
if (process.env.REACT_APP_ENV === "prod") {
  console.log = () => {};
  console.error = () => {};
  console.debug = () => {};
  console.warn = () => {};
}
```

### RTL (Right-to-Left) Support

- Arabic language uses a separate stylesheet: `src/ar.css`
- French uses: `src/fr.css`
- Language is detected from: URL path → `localStorage` → `htmlTag` → `cookie`
- The fallback language is English (`en`)

### Redux DevTools

Redux DevTools Extension is active in all environments. Install the [browser extension](https://github.com/reduxjs/redux-devtools) to inspect state and dispatched actions.

### Adding a New Environment Variable

1. Add it to `.env` with the `REACT_APP_` prefix (required by CRA)
2. Access it in code via `process.env.REACT_APP_YOUR_VAR`
3. Restart the dev server — env vars are baked in at startup, not hot-reloaded

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `Module not found: stream` | Run `npm install` — craco.config.js provides the browserify fallback |
| Blank page after login | Check `REACT_APP_BASE_URL` — ensure backend services are reachable |
| PDFTron viewer not loading | Verify `public/webviewer/` folder exists and `REACT_APP_APRYSEKEY` is set |
| MQTT connection errors | Verify `REACT_APP_MQTT`, `REACT_APP_MQTT_PORT`, and credentials |
| Google login fails | Verify `REACT_APP_GOOGLE_CLIENT_ID` and OAuth redirect URIs in Google Console |
