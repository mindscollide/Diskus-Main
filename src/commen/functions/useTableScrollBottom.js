/**
 * @file useTableScrollBottom.js
 * @description React hook that fires a callback when the user scrolls to (or
 * near) the bottom of an Ant Design table body, enabling infinite-scroll /
 * load-more pagination patterns.
 */
import { useEffect, useRef, useState } from "react";

/**
 * Attaches a scroll listener to the first `.ant-table-body` element found in
 * the DOM and calls `onBottomReach` once per "bottom reached" event.
 * Resets when the user scrolls back up, allowing repeated triggers on
 * subsequent scroll-to-bottom events.
 *
 * @param {() => void|Promise<void>} onBottomReach - Async-safe callback invoked
 *   when the table is scrolled to the bottom.
 * @param {number} [threshold=0] - Extra pixel buffer above the true bottom at
 *   which the callback fires (useful when the last row is partially hidden).
 * @returns {{
 *   containerRef: React.RefObject<Element>,
 *   hasReachedBottom: boolean,
 *   setHasReachedBottom: React.Dispatch<React.SetStateAction<boolean>>
 * }}
 */
export const useTableScrollBottom = (onBottomReach, threshold = 0) => {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Try to find either .ant-table-body or .gridviewDataroom
    const scrollContainer =
      document.querySelector(".ant-table-body")
    console.log(scrollContainer, "scrollContainerscrollContainer");
    if (scrollContainer) {
      containerRef.current = scrollContainer;

      const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
        console.log(isBottom, "scrollContainerscrollContainer");

        if (isBottom && !hasReachedBottom) {
          setHasReachedBottom(true);
          await onBottomReach?.();
        }

        if (!isBottom && hasReachedBottom) {
          setHasReachedBottom(false);
        }
      };

      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [hasReachedBottom, onBottomReach, threshold]);

  return {
    containerRef,
    hasReachedBottom,
    setHasReachedBottom,
  };
};
