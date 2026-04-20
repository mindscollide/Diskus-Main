/**
 * @file use-onclick-outside.js
 * @description Custom React hook that fires a handler when a click or touch occurs outside a given ref element.
 */

import { useEffect } from "react";

/**
 * Attaches mousedown and touchstart listeners to detect outside clicks relative to a ref.
 * @param {React.RefObject} ref - The ref whose element defines the "inside" boundary.
 * @param {Function} handler - Callback invoked when an outside click is detected.
 */
export default function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
