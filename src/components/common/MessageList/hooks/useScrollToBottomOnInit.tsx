import { useEffect } from "react";

export const useScrollToBottomOnInit = (
  ref: React.RefObject<HTMLElement>,
  dependency: any,
  isInitial: boolean,
  onScrolled?: () => void
) => {
  useEffect(() => {
    if (ref.current && isInitial) {
      const element = ref.current;
      element.scrollTop = element.scrollHeight;
      onScrolled?.();
    }
  }, [ref, dependency, isInitial, onScrolled]);
};
