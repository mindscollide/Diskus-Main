import { useEffect, useRef } from "react";

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
