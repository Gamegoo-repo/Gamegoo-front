/**
 * window.matchMedia 를 활용하여 programmatically 하게 media query 를 활용하도록 하는 hook
 * References: https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia
 */
import { useState, useEffect } from "react";

export interface UseMediaQueriesProps {
  breakpoint: number;
}

const useMediaQueries = ({ breakpoint }: UseMediaQueriesProps) => {
  /**
   * 주어진 breakpoint 보다 화면이 작을 경우 match 를 true 로 초기화 시킨다
   */
  const [mediaQuery, setmediaQuery] = useState<Partial<MediaQueryListEvent>>({
    matches: window.innerWidth < breakpoint ? true : false,
    media: "",
  });

  useEffect(() => {
    /**
     * window.matchMedia 에 쿼리를 전달하여 받은 mediaQueryList 를 가져오고
     * change event handler 를 달아서 주어진 미디어 쿼리를 기반해서 viewport 가 breakpoint 사이에서 변화가 있다면
     * 콜백 함수로 주어진 changeHandler 를 호출한다
     * References: https://developer.mozilla.org/en-US/docs/Web/API/static/mediaQueryList
     */
    const mediaQueryList = matchMedia(`(max-width: ${breakpoint}px)`);

    const changeHandler = (e: MediaQueryListEvent) => {
      setmediaQuery(e);
    };

    // for chrome, firefox and modern browsers
    try {
      mediaQueryList.addEventListener("change", changeHandler);
    } catch (error) {
      try {
        // IE 는 onChange 를 아예 지원하지 않아서 지금은 deprecated 된 addListener 를 사용해야 한다
        mediaQueryList.addListener(changeHandler);
      } catch (error2) {
        // 그래도 error 가 나면 sentry 로
        console.error(error2);
      }
    }

    return () => {
      // for addEventListener
      mediaQueryList.removeEventListener("change", changeHandler);
      // for addListener
      mediaQueryList.removeListener(changeHandler);
    };
  }, []);

  return mediaQuery.matches;
};

export default useMediaQueries;
