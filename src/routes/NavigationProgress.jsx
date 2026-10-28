import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getPendingPages, subscribePendingPages } from "./lazyPage";
import styles from "./NavigationProgress.module.css";

// Even an instant (already loaded) route change shows a short sweep, so every
// navigation gets the same feedback instead of only the first visit of a page.
const MIN_VISIBLE_MS = 250;
// How long the finishing animation (fill to 100%, then fade) runs before unmounting.
const FINISH_MS = 300;

/**
 * Thin progress bar fixed to the top of the window on EVERY route change.
 *
 * - Starts the moment the router commits a new pathname (router.subscribe).
 * - Stays for at least MIN_VISIBLE_MS, and for as long as a lazily loaded page chunk
 *   is still downloading (lazyPage.js counts those), so slow first visits keep creeping
 *   towards ~92% until the page is ready.
 * - Then fills to 100% and fades out.
 * The previous page stays visible underneath (React Router runs navigations in a
 * transition), so the bar is what tells the user the click was registered.
 *
 * Phases: idle -> running -> finishing -> idle. `id` changes on every navigation so a
 * new navigation restarts the animation even if the previous one is still running.
 */
const NavigationProgress = ({ router }) => {
  const pending = useSyncExternalStore(subscribePendingPages, getPendingPages);
  const [run, setRun] = useState({ id: 0, phase: "idle" });
  const startedAt = useRef(0);

  // every pathname change starts (or restarts) the bar
  useEffect(() => {
    let last = router.state.location.pathname;
    return router.subscribe((state) => {
      const next = state.location.pathname;
      if (next === last) return;
      last = next;
      startedAt.current = Date.now();
      setRun((r) => ({ id: r.id + 1, phase: "running" }));
    });
  }, [router]);

  // finish once nothing is loading and the minimum visible time has passed
  useEffect(() => {
    if (run.phase !== "running" || pending > 0) return undefined;
    const wait = Math.max(0, MIN_VISIBLE_MS - (Date.now() - startedAt.current));
    const t = setTimeout(
      () => setRun((r) => (r.phase === "running" ? { ...r, phase: "finishing" } : r)),
      wait,
    );
    return () => clearTimeout(t);
  }, [run, pending]);

  // finishing animation done -> unmount (unless a newer navigation restarted it)
  useEffect(() => {
    if (run.phase !== "finishing") return undefined;
    const t = setTimeout(
      () => setRun((r) => (r.phase === "finishing" ? { ...r, phase: "idle" } : r)),
      FINISH_MS,
    );
    return () => clearTimeout(t);
  }, [run]);

  if (run.phase === "idle") return null;
  return (
    <div
      key={run.id}
      className={`${styles.bar} ${run.phase === "finishing" ? styles.finishing : styles.running}`}
      role='progressbar'
      aria-label='Loading page'
      data-nav-progress={run.phase}
    />
  );
};

export default NavigationProgress;
