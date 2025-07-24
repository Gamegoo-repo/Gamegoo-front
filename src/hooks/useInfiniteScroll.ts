import { useEffect } from "react";

import type { RefObject } from "react";

interface UseInfiniteScrollProps<T> {
  cursor: T | null;
  hasNext: boolean | undefined;
  isLoading: boolean;
  sentinelRef: RefObject<Element>;
  onIntersect: (cursor: T) => void;
  enabled?: boolean;
  rootMargin?: string;
}

const useInfiniteScroll = <T>({
  cursor,
  hasNext = false,
  isLoading,
  sentinelRef,
  onIntersect,
  enabled = true,
  rootMargin = "100px",
}: UseInfiniteScrollProps<T>) => {
  useEffect(() => {
    if (!cursor || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNext && !isLoading) {
            onIntersect(cursor);
          }
        });
      },
      {
        rootMargin,
      }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [
    cursor,
    hasNext,
    isLoading,
    enabled,
    rootMargin,
    sentinelRef,
    onIntersect,
  ]);
};

export default useInfiniteScroll;
