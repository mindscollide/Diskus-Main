import { useEffect, useRef, useState } from "react";

export const useTableScrollBottom = (onBottomReach, threshold = 0) => {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Try to find either .ant-table-body or .gridviewDataroom
    const scrollContainer =
      document.querySelector(".ant-table-body") ||
      document.querySelector(".ant-table-tbody");
    console.log(scrollContainer, "scrollContainerscrollContainer");
    if (scrollContainer) {
      containerRef.current = scrollContainer;

      const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isBottom = scrollTop + clientHeight >= scrollHeight + 0;
        console.log(isBottom, "scrollContainerscrollContainer");

        if (isBottom) {
          setHasReachedBottom(true);
          await onBottomReach?.();
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
