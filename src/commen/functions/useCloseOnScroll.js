import { useEffect } from "react";

/**
 * Closes an open three-dot/actions Popover (or any open overlay) as soon as
 * the page scrolls, instead of leaving it floating in its original screen
 * position until the user clicks elsewhere. Antd's Popover has no built-in
 * "close on scroll" behavior, and none of this app's controlled-Popover
 * three-dot menus had one either.
 *
 * `capture: true` so this fires for scroll events from nested scrollable
 * containers too (e.g. an antd Table's internal `.ant-table-body`, or a
 * Data Room list) — plain `scroll` listeners on `window` only catch
 * window-level scrolling, since `scroll` doesn't bubble.
 *
 * @param {() => void} close - called (with no args) whenever a scroll is
 *   detected while `isOpen` is true. Typically `() => setOpenX(null)` or
 *   `() => setVisible(false)`.
 * @param {boolean} isOpen - only attaches the listener while something is
 *   actually open, so this stays a no-op the rest of the time.
 */
export const useCloseOnScroll = (close, isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleScroll = () => close();
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [isOpen, close]);
};
