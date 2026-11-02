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

export const lazyPage = (factory) =>
  lazy(() => {
    pending += 1;
    emit();
    return importWithRetry(factory).finally(() => {
      pending -= 1;
      emit();
    });
  });
