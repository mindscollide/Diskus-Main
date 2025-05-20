import { useEffect, useRef, useState } from 'react';

export const useTableScrollBottom = (onBottomReach, threshold = 0) => {
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Try to find either .ant-table-body or .gridviewDataroom
    const scrollContainer =
      document.querySelector('.ant-table-body') ||
      document.querySelector('.gridviewDataroom');
    console.log(scrollContainer, "scrollContainerscrollContainer")
    if (scrollContainer) {
      containerRef.current = scrollContainer;

      const handleScroll = async () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
        const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
        console.log(isBottom, "scrollContainerscrollContainer")

        if (isBottom && !hasReachedBottom) {
          setHasReachedBottom(true);
          await onBottomReach?.();
        }

        if (!isBottom && hasReachedBottom) {
          setHasReachedBottom(false);
        }
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [hasReachedBottom, onBottomReach, threshold]);

  return {
    containerRef,
    hasReachedBottom,
    setHasReachedBottom,
  };
};
