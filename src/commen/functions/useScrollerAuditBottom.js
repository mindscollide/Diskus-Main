/**
 * @file useScrollerAuditBottom.js
 * @description Custom React hook that fires a callback when the Ant Design
 * table scroll container reaches (or nears) the bottom. Used to trigger
 * infinite-scroll pagination across all DataRoom table views.
 */
import { useEffect, useRef } from "react";

/**
 * Attaches a scroll listener to the nearest `.ant-table-body` element and
 * calls `onBottomReach` when the user scrolls within `threshold` pixels of
 * the bottom. A 300 ms debounce ref prevents multiple rapid-fire triggers.
 *
 * @param {() => Promise<void>} onBottomReach - Async callback invoked when bottom is reached.
 * @param {number} [threshold=50] - Distance in pixels from the bottom that counts as "reached".
 */
export const useScrollerAuditBottom = (onBottomReach, threshold = 50) => {
  const isFetchingRef = useRef(false); // prevent multiple triggers

  useEffect(() => {
    const scrollContainer = document.querySelector(".ant-table-body");

    if (!scrollContainer) return;

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      if (isBottom && !isFetchingRef.current) {
        isFetchingRef.current = true;
        try {
          await onBottomReach?.();
        } finally {
          // Add small delay to avoid repeated triggering in short time
          setTimeout(() => {
            isFetchingRef.current = false;
          }, 300); // delay to debounce next trigger
        }
      }
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [onBottomReach, threshold]);
};
