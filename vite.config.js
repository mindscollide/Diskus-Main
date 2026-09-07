import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

/**
 * Every `process.env.REACT_APP_*` name referenced anywhere in `src`.
 *
 * Needed because a `define` is only generated for variables that are actually
 * SET, and the two sets differ: `REACT_APP_GOOGLE_CLIENT_ID` is read by
 * src/index.js but is absent from .env.local. With no define for it the
 * expression survived minification into the shipped bundle as a live
 * `process.env` property access — which is at best `undefined` and at worst a
 * ReferenceError, since `process` does not exist in a browser.
 *
 * Scanning the source instead of trusting the env file means every reference
 * gets a define regardless of which .env the build used, so no `process.env`
 * can ever reach the output.
 */
function referencedEnvNames(dir, found = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      referencedEnvNames(full, found);
    } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      const src = fs.readFileSync(full, "utf8");
      for (const m of src.matchAll(/process\.env\.(REACT_APP_[A-Z0-9_]+)/g)) {
        found.add(m[1]);
      }
    }
  }
  return found;
}

/**
 * Vite configuration — replaces Create React App (react-scripts) + craco.
 *
 * Four things here are non-obvious and load-bearing. Read them before changing
 * anything, because each one is working around a real property of this codebase
 * rather than being a stylistic preference.
 */
export default defineConfig(({ mode }) => {
  /**
   * (1) ENVIRONMENT VARIABLES — deliberately NOT Vite's `loadEnv`.
   *
   * Vite's own env loading would break this project. It always loads
   * `.env.local` on top of `.env.[mode]`, and `.env.local` here holds the DEV
   * API URLs — so `vite build --mode production` would silently ship a bundle
   * pointing at the dev backend.
   *
   * Instead the npm scripts keep using `env-cmd -f .env.<target>`, exactly as
   * they did under CRA, which puts the chosen file's variables on `process.env`
   * before Vite starts. We read them from there, so environment selection
   * behaves identically to before this migration and there is one less thing to
   * re-verify per environment.
   *
   * Each variable is defined individually rather than replacing `process.env`
   * wholesale: a blanket `define` of `process.env` would break
   * `process.env.NODE_ENV`, which is used in the app and injected by Vite.
   */
  const names = new Set([
    // set in the .env file this build was invoked with
    ...Object.keys(process.env).filter((k) => k.startsWith("REACT_APP_")),
    // referenced in source, whether or not this .env happens to set it
    ...referencedEnvNames(path.resolve(__dirname, "src")),
  ]);

  const clientEnv = Object.fromEntries(
    [...names].map((key) => [
      `process.env.${key}`,
      // An unset variable becomes the literal `undefined`, matching CRA, rather
      // than being left as a live property access on a non-existent `process`.
      JSON.stringify(process.env[key] ?? undefined) ?? "undefined",
    ]),
  );

  // Read by a handful of files and by some dependencies; Vite does not inject
  // it into `process.env` the way CRA did.
  clientEnv["process.env.NODE_ENV"] = JSON.stringify(
    mode === "production" ? "production" : "development",
  );

  return {
    plugins: [react()],

    /**
     * (2) JSX INSIDE `.js` FILES.
     *
     * 588 files in `src` contain JSX but use the `.js` extension, which esbuild
     * treats as plain JavaScript — every one of them would fail to parse. These
     * two settings point the JSX loader at `.js` as well.
     *
     * `optimizeDeps.esbuildOptions` covers the dependency pre-bundling pass and
     * `esbuild.include` covers app source; both are needed, they run at
     * different stages.
     *
     * The proper fix is renaming those files to `.jsx` — imports are
     * extensionless so a rename is safe — at which point both blocks can go.
     * Kept as config for now so the migration is reviewable without a
     * 588-file rename buried in the same commit.
     */
    esbuild: {
      loader: "jsx",
      include: /src\/.*\.[jt]sx?$/,
      exclude: [],
    },
    optimizeDeps: {
      /**
       * Without this, Vite's dependency scanner globs EVERY .html in the project
       * and treats each as an entry point — including Apryse's own bundled UI
       * (public/webviewer/lib/ui/index.html, .../core/pdf/iframe.html), the
       * font-icon demo page and talk-chat's print.html. Those are third-party or
       * standalone documents, not app entries, and scanning them produced
       * spurious "Failed to scan for dependencies" errors on dev start.
       *
       * The app has exactly one entry.
       */
      entries: ["index.html"],

      /**
       * moment and its locale files MUST be pre-bundled in the same pass.
       *
       * `import "moment/locale/ar"` works by side effect: it calls
       * `defineLocale` on the moment singleton it imports. If Vite discovers the
       * locales in a later optimize pass than moment itself, it produces two
       * separate copies of moment's implementation — observed here as
       * chunk-CR4OMIWS (147 kB) and chunk-R5GOII4R (128 kB), each containing its
       * own `defineLocale`. The locales then register on an instance the app
       * never uses, and every non-English date silently renders in English.
       *
       * Listing them here forces one pass and one instance. Production is not
       * affected (Rollup dedupes), so this is a dev-only correctness fix — which
       * is exactly the kind that gets missed, because the build looks fine.
       *
       * Keep in sync with the `moment/locale/*` imports in
       * components/elements/calendar/Calendar.js and
       * components/elements/time_picker/Time_picker.js.
       */
      include: [
        "moment",
        "moment/dist/locale/ar",
        "moment/dist/locale/ar-sa",
        "moment/dist/locale/fr",
        "moment/dist/locale/en-gb",
      ],

      esbuildOptions: {
        loader: { ".js": "jsx" },
      },
    },

    define: clientEnv,

    resolve: {
      alias: [
        // Used by ~312 imports. Was provided by craco under CRA.
        { find: "@", replacement: path.resolve(__dirname, "src") },

        /**
         * Pin `moment` to its ESM build.
         *
         * A locale file registers itself by side effect on whichever moment copy
         * it imports, so everything must end up on ONE instance. It did not:
         * moment's package main is the UMD `moment/moment.js`, and Vite's
         * dependency optimiser bundled the CommonJS locale files into a second
         * private copy. Executing the optimised output proved the consequence —
         * `moment.locales()` returned only `en`, and `moment.locale("ar")`
         * silently fell back to English. Every Arabic and French date in dev
         * rendered in English, with no error anywhere.
         *
         * `moment/dist/moment.js` and `moment/dist/locale/*` are true ESM and
         * import each other by relative path, so aliasing the bare specifier to
         * the ESM build puts the app, antd, moment-timezone and the locale files
         * all on the same module. The exact-match regex matters: a plain "moment"
         * alias would also rewrite `moment-timezone` and `moment/dist/...`.
         *
         * Paired with the `moment/dist/locale/*` imports in
         * components/elements/calendar/Calendar.js and
         * components/elements/time_picker/Time_picker.js — the two must agree.
         */
        {
          find: /^moment$/,
          replacement: path.resolve(__dirname, "node_modules/moment/dist/moment.js"),
        },
      ],
    },

    server: {
      // CRA's default, so existing bookmarks, CORS allow-lists and OAuth
      // redirect URIs registered against localhost:3000 keep working.
      port: 3000,
      open: false,
    },

    build: {
      /**
       * (3) OUTPUT DIRECTORY.
       *
       * CRA emitted to `build/`; Vite defaults to `dist/`. Kept as `build/` so
       * deployment scripts, CI config and `.gitignore` need no changes.
       */
      outDir: "build",

      /**
       * (4) SOURCE MAPS OFF.
       *
       * Same decision as the CRA setup: source maps were the single largest
       * slice of production build time, and nothing consumes them. Set to true
       * temporarily if you need to debug a production bundle.
       */
      sourcemap: false,
    },
  };
});
