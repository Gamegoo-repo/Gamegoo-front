import { useEffect } from "react";

export const useInfiniteScrollTop = (
  ref: React.RefObject<HTMLElement>,
  onTopReached: () => void,
  canLoad: boolean
) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      if (element.scrollTop === 0 && canLoad) {
        onTopReached();
      }
    };

    element.addEventListener("scroll", handleScroll);
    return () => element.removeEventListener("scroll", handleScroll);
  }, [ref, onTopReached, canLoad]);
};
