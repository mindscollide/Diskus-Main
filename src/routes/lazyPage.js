import { lazy } from "react";

/**
 * React.lazy that
 *  1. reports "a page chunk is being fetched" to a tiny store, so a top progress bar
 *     (NavigationProgress) can show while the old page is still on screen. React.lazy
 *     calls its factory once, the first time that page renders, which is exactly when
 *     a download/compile starts; already-loaded pages never touch the counter again.
 *  2. retries a chunk that failed to download. A dropped connection or an HTTP/2
 *     reset on one /assets file must not take the page down: the second attempt
 *     almost always succeeds (and is then served from cache). Only when every attempt
 *     fails does the error reach RouteBoundary, which reloads once for stale deploys.
 */
let pending = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const subscribePendingPages = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getPendingPages = () => pending;

const LOAD_ERROR =
  /Unable to preload|dynamically imported module|Importing a module script failed|Loading chunk|Loading CSS chunk/i;
const RETRY_DELAYS_MS = [400, 1200];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Vite keeps the <link> of a stylesheet / modulepreload that failed and then treats
// it as "already requested", so a plain second import() would skip the download and
// render the page without its CSS. A failed stylesheet has no `sheet`; remove it so
// the retry fetches it again.
const dropFailedAssetLinks = () => {
  document
    .querySelectorAll('link[rel="stylesheet"][href*="/assets/"]')
    .forEach((link) => {
      if (!link.sheet) link.remove();
    });
  document
    .querySelectorAll('link[rel="modulepreload"][href*="/assets/"]')
    .forEach((link) => link.remove());
};

// Vite adds a chunk's stylesheet as a <link> and skips any <link> that is already in
// the document, treating it as "already requested" without waiting for it. When a
// stylesheet is still downloading (or failed) because another page asked for it a
// moment earlier, this page's import() resolves immediately and the page renders
// unstyled. So before a page is shown, make sure every /assets stylesheet really
// loaded: any link without a `sheet` is requested again and awaited, and a failure
// is thrown so importWithRetry can try again.
const waitForStylesheets = () =>
  Promise.all(
    Array.from(
      document.querySelectorAll('link[rel="stylesheet"][href*="/assets/"]'),
    )
      .filter((link) => !link.sheet)
      .map(
        (stale) =>
          new Promise((resolve, reject) => {
            const fresh = document.createElement("link");
            fresh.rel = "stylesheet";
            fresh.crossOrigin = stale.crossOrigin;
            // same attribute text as the original so Vite's own lookup still matches
            fresh.setAttribute("href", stale.getAttribute("href"));
            fresh.onload = () => {
              stale.remove();
              resolve();
            };
            fresh.onerror = () => {
              fresh.remove();
              reject(
                new Error(`Unable to preload CSS for ${stale.getAttribute("href")}`),
              );
            };
            document.head.appendChild(fresh);
          }),
      ),
  );

const importWithRetry = async (factory) => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      const module = await factory();
      await waitForStylesheets();
      return module;
    } catch (error) {
      const retriesLeft = attempt < RETRY_DELAYS_MS.length;
      if (!retriesLeft || !LOAD_ERROR.test(String(error?.message))) throw error;
      dropFailedAssetLinks();
      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }
};

// Every page created with lazyPage, in creation order, for startIdlePrefetch.
const allPages = [];

export const lazyPage = (factory) => {
  const Component = lazy(() => {
    pending += 1;
    emit();
    return importWithRetry(factory).finally(() => {
      pending -= 1;
      emit();
    });
  });
  // Plain import for idle prefetching: it does not touch the pending counter (no
  // spinner / progress bar) and has no retries, a failure just stops the prefetch.
  Component.preload = () => factory();
  allPages.push(Component);
  return Component;
};

const whenIdle = (callback) =>
  typeof window.requestIdleCallback === "function"
    ? window.requestIdleCallback(callback, { timeout: 5000 })
    : setTimeout(callback, 2000);

// Not on data-saver mode or a 2G connection, where a background download would cost
// the user more than it saves.
const connectionAllowsPrefetch = () => {
  const connection = navigator.connection;
  return !(
    connection &&
    (connection.saveData || /(^|-)2g$/.test(connection.effectiveType || ""))
  );
};

let prefetchStarted = false;

/**
 * Downloads every lazyPage component in the background, one at a time, each only
 * when the browser is idle. Runs once, and only for a signed-in user.
 *  - waits while a page the user opened is still loading, so it never competes
 *    with a real navigation;
 *  - stops at the first failure: if the server is struggling, extra background
 *    requests would only make it worse, and the page still loads on demand.
 */
export const startIdlePrefetch = () => {
  if (
    prefetchStarted ||
    !localStorage.getItem("token") ||
    !connectionAllowsPrefetch()
  ) {
    return;
  }
  prefetchStarted = true;

  const queue = [...allPages];
  const step = () =>
    whenIdle(async () => {
      if (pending > 0) {
        step();
        return;
      }
      const page = queue.shift();
      if (!page) return;
      try {
        await page.preload();
        step();
      } catch (error) {
        // stop prefetching; the page will load on demand
      }
    });
  step();
};
