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

const importWithRetry = async (factory) => {
  for (let attempt = 0; ; attempt += 1) {
    try {
      return await factory();
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
