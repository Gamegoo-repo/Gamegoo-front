import { useState, useEffect } from "react";

export interface UseMediaQueriesProps {
  breakpoint: number;
}

const useMediaQueries = ({ breakpoint }: UseMediaQueriesProps) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // SSR 환경에서는 window가 없으므로, useEffect 내부에서만 사용해야 안전함
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(`(max-width: ${breakpoint}px)`);

    const changeHandler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    // 초기값 설정
    setMatches(mediaQueryList.matches);

    try {
      mediaQueryList.addEventListener("change", changeHandler);
    } catch (error) {
      try {
        mediaQueryList.addListener(changeHandler);
      } catch (error2) {
        console.error(error2);
      }
    }

    return () => {
      try {
        mediaQueryList.removeEventListener("change", changeHandler);
      } catch {
        mediaQueryList.removeListener(changeHandler);
      }
    };
  }, [breakpoint]);

  return matches;
};

export default useMediaQueries;
