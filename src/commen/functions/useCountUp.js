import { useEffect, useRef, useState } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Returns a number that counts from its current value up (or down) to `target`.
 * Starts at 0 on first mount, and when `target` changes again later it continues
 * from whatever is currently shown, so live (socket) updates tick over smoothly
 * instead of jumping. With "reduce motion" on it just returns the target.
 */
export const useCountUp = (target, duration = 900) => {
  const end = Number(target) || 0;
  const [value, setValue] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    const from = shownRef.current;
    if (from === end) return undefined;

    if (prefersReducedMotion()) {
      shownRef.current = end;
      setValue(end);
      return undefined;
    }

    const startedAt = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      const next = Math.round(from + (end - from) * eased);
      shownRef.current = next;
      setValue(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [end, duration]);

  return value;
};
