import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  ErrorFallback,
  logErrors,
} from "../components/elements/ErrorFallBack/index.jsx";
import PageFallback from "./PageFallback.jsx";

// What browsers report when a lazily loaded chunk can't be fetched. After a
// new deploy the hashed filenames of the old build disappear, so a tab that
// was open across the deploy fails to load the chunk of a page it had not
// visited yet.
const CHUNK_ERROR =
  /dynamically imported module|Importing a module script failed|Loading chunk|Loading CSS chunk/i;
const RELOAD_FLAG = "chunkReloadAttemptedAt";

const onRouteError = (error, info) => {
  if (CHUNK_ERROR.test(String(error?.message))) {
    // Reload once to pick up the new build. The timestamp guard stops a reload
    // loop if the chunk is genuinely missing (e.g. the server is down).
    try {
      const last = Number(sessionStorage.getItem(RELOAD_FLAG) || 0);
      if (Date.now() - last > 30000) {
        sessionStorage.setItem(RELOAD_FLAG, String(Date.now()));
        window.location.reload();
        return;
      }
    } catch (e) {
      // sessionStorage unavailable: fall through to the normal error UI.
    }
  }
  logErrors(error, info);
};

/**
 * The wrapper every route element sits in: the error boundary the routes
 * always had, plus a Suspense boundary for lazily loaded pages.
 *
 * Order matters. The ErrorBoundary is outermost so that a chunk that fails to
 * load (a rejected `import()`) lands in the normal ErrorFallback instead of
 * unmounting the whole app, and Suspense sits inside it so the fallback shows
 * only for the page area.
 */
const RouteBoundary = ({ children }) => (
  <ErrorBoundary FallbackComponent={ErrorFallback} onError={onRouteError}>
    <Suspense fallback={null}>{children}</Suspense>
  </ErrorBoundary>
);

export default RouteBoundary;
