import { lazy } from "react";

/**
 * React.lazy that also reports "a page chunk is being fetched" to a tiny store,
 * so a top progress bar (NavigationProgress) can show while the old page is still
 * on screen. React.lazy calls its factory once, the first time that page renders,
 * which is exactly when a download/compile starts; already-loaded pages never touch
 * the counter again.
 */
let pending = 0;
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

export const subscribePendingPages = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export const getPendingPages = () => pending;

export const lazyPage = (factory) =>
  lazy(() => {
    pending += 1;
    emit();
    return factory().finally(() => {
      pending -= 1;
      emit();
    });
  });
