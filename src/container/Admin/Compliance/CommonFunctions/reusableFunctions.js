import { useEffect, useRef, useState } from "react";
import { debounce } from "lodash"; // ← Debounce imported here

export const useTableScrollBottom = (onBottomReach, threshold = 0) => {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const scrollContainer = document.querySelector(".ant-table-body");

    if (scrollContainer) {
      containerRef.current = scrollContainer;

      const handleScroll = debounce(() => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;

        const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
        console.log(
          isBottom,
          hasReachedBottom,
          "hasReachedBottomhasReachedBottom"
        );
        if (isBottom && !hasReachedBottom) {
          setHasReachedBottom(true);
          onBottomReach?.();
        } else if (!isBottom && hasReachedBottom) {
          setHasReachedBottom(false);
        }
      }, 100);

      scrollContainer.addEventListener("scroll", handleScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
        handleScroll.cancel();
      };
    }
  }, [hasReachedBottom, onBottomReach, threshold]);

  return {
    hasReachedBottom,
    containerRef,
    setHasReachedBottom,
  };
};
