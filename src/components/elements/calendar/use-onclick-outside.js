/**
 * @hook useOnClickOutside
 * @description A custom React hook that invokes a handler callback whenever
 * the user clicks or taps outside of the element referenced by `ref`. Useful
 * for closing dropdowns, modals, or popovers when the user interacts with
 * the rest of the page.
 *
 * @param {React.RefObject} ref     - A React ref attached to the element to monitor.
 * @param {Function}        handler - Callback to invoke when a click/touch outside is detected.
 * @returns {void}
 */
import { useEffect } from "react";

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
