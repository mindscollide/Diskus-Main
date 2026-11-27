# Runtime configuration: one build, many environments

The app is built **once** and the same `build/` folder is deployed to UAT, staging,
production, PSO, etc. What differs per deployment lives in one file next to
`index.html`: `runtime-config.js`.

## How it works

1. `index.html` loads `/runtime-config.js` with a plain `<script>` placed **before** the
   module script. Module scripts are deferred, so `window.APP_CONFIG` always exists
   before any application code runs.
2. `src/config/appConfig.js` is the only module that reads `window.APP_CONFIG`. It
   validates it once and exports a frozen object. A missing or malformed value stops
   the app and prints which property is wrong (on the page and in the console).
3. Everything else imports `appConfig`: `Api_ends_points.js` (service URLs),
   `axiosInstance.js` (base URL), `mqttconnection*.js` (broker), `featureFlags.js`,
   `disableConsole.js` and the places that used `REACT_APP_VIDEO_EVENTS`,
   `REACT_APP_APRYSEKEY`, `REACT_APP_MS_LOGIN_URL`, `REACT_APP_ENV`.

## runtime-config.js properties

See the commented template in `public/runtime-config.js`. Required: `ENV`, `BASE_URL`,
`MQTT_HOST`, `MQTT_PORT` and the 22 service paths. Optional: `VIDEO_EVENTS`,
`MS_LOGIN_URL`, `APRYSE_KEY`, `GOOGLE_CLIENT_ID`, `LOGOUT_AUTH_API`, `SOCKET_API`.
Flags: `HIDE_VIDEO`, `MANAGE_AGENDA_START_END_TIME`, `HIDE_HEADER_FREETRAIL_BAR`,
`SHOW_PSO_LOGO`.

The file is public. Never put passwords, keys or tokens in it.

## What is still build-time

Three values are identical in every environment and are not deployment settings, so
they remain `REACT_APP_*` build-time variables read from `.env.build`
(see `env.build.example`):

| Variable | Why it is not in runtime-config.js |
|---|---|
| `REACT_APP_SECERETKEY` | Obfuscation key for localStorage and the MQTT credentials |
| `REACT_APP_MQTT_User`, `REACT_APP_MQTT_Pass` | MQTT credentials (stored encrypted) |

They are already part of every bundle today. Keeping them out of `runtime-config.js`
means an editable, publicly readable file never holds credentials. `process.env.NODE_ENV`
is also still used (Vite sets it).

## Build

```powershell
copy env.build.example .env.build     # once per machine; fill in the three values
npm run build                         # output: build/
```

`npm start` uses the same `.env.build`. For local development put your own values in
`runtime-config.local.js` in the project root (git-ignored, served at `/runtime-config.js`
by the dev server only):

```powershell
node scripts/generate-runtime-config.cjs .env.local runtime-config.local.js
```

## Deploy (IIS)

1. Build once (above).
2. Copy the `build/` folder to the IIS site folder. `web.config` is inside it.
3. Replace `runtime-config.js` in the site folder with the file for that environment.
   To create one from an old environment file:
   `node scripts/generate-runtime-config.cjs .env.uat deploy-config/runtime-config.uat.js`
4. To change an environment later, edit only `runtime-config.js` on the server. No rebuild,
   no redeploy of `assets/`.

When deploying a new build over an existing site, **do not overwrite the site's own
`runtime-config.js`** (exclude it from the copy), or put the environment's file back.

### What `web.config` configures

- `runtime-config.js`: `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
- `index.html`: `Cache-Control: no-cache` (always revalidated)
- `/assets/*`: one year `max-age` (file names carry a content hash)
- React Router refresh: URLs that are not files and have no file extension are rewritten
  to `/index.html`. A missing file with an extension stays a real 404.
- Requires the IIS **URL Rewrite** module. The app is built for the site root
  (Vite `base` is `/`), so deploy it at the root of a site, not in a virtual directory.

## One URL, one configuration

`runtime-config.js` is global to the origin it is served from. One URL cannot serve two
different configurations at the same time; use one site (or host name) per environment.

## Checking a deployment

- Open `https://<site>/runtime-config.js`: it must show the environment's values, and the
  response must carry `Cache-Control: no-store`.
- If the app shows `[appConfig] Invalid /runtime-config.js`, the message lists every
  property that is missing or wrong.
- If it shows `window.APP_CONFIG is not defined`, the file is missing or the server is
  returning the SPA fallback page instead of the JavaScript file.
