"use client";

import { useEffect, useRef, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { usePathname } from "next/navigation";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import styled, { ThemeProvider } from "styled-components";

import { Footer, Header, SocketConnection } from "@/components";
import ko from "@/constants/ko.json";
import { STORAGE_KEY } from "@/constants/storage";
import { MediaQueryProvider } from "@/contexts/MediaQueryContext";
import { notify } from "@/hooks";
import StyledComponentsRegistry from "@/libs/registry";
import { store as createStore } from "@/redux/store";
import { connectSocket, sendMatchingQuitEvent, socket } from "@/socket";
import { pretendard, timeForSalad } from "@/styles/fonts";
import GlobalStyles from "@/styles/GlobalStyles";
import { theme } from "@/styles/theme";
import {
  getAccessToken,
  getIsCompleted,
  setIsCompleted,
} from "@/utils/storage";

import type { AppStore } from "@/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  const [persistor, setPersistor] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  if (!storeRef.current) {
    storeRef.current = createStore();
  }

  // SSR-safe: 클라이언트에서만 persistor 생성
  useEffect(() => {
    const ps = persistStore(storeRef.current!);
    setPersistor(ps);
  }, []);

  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const isNotFoundPage = pathname === "/404" || pathname === "/not-found";
  const isHeaderFooterShow = !(
    isNotFoundPage ||
    pathname === "/login" ||
    pathname.includes("/join") ||
    pathname.includes("/password") ||
    pathname.includes("/riot")
  );

  /* 로그인 이전 소켓 연결 */
  useEffect(() => {
    if (!socket) {
      connectSocket();
      sessionStorage.removeItem(STORAGE_KEY.logout);
    }
  }, []);

  const isCompleted = getIsCompleted();

  useEffect(
    () => {
      if (isCompleted === "true") {
      } else if (
        !pathname.includes("/matching/complete") &&
        previousPathname.current !== pathname &&
        previousPathname.current.includes("/matching")
      ) {
        sendMatchingQuitEvent();
        notify({
          text: ko["matching.quit.default"],
          icon: "🚫",
          type: "error",
        });
      }

      if (pathname.includes("/") || pathname.includes("/match")) {
        setIsCompleted("false");
      }

      // 이전 경로 업데이트
      previousPathname.current = pathname;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  /* 로그인 상태 변경 시 리렌더링 트리거 */
  /* 로그아웃 후 재로그인 시 SocketConnection 컴포넌트가 리렌더링되지 않아서 만듦 */
  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, [pathname]);

  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${timeForSalad.variable}`}
    >
      <head>
        <title>롤 실시간 듀오 매칭 - GAMEGOO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
        <meta
          name="description"
          content="리그 오브 레전드 유저를 위한 실시간 듀오 매칭 서비스입니다.
듀오 찾기 게시판, 실시간 채팅, 친구 추가 기능을 통해 원하는 게임 친구를 바로 찾아보세요."
        />
        <link rel="icon" href="/icon.png" />
      </head>
      <body>
        <GoogleTagManager
          gtmId={process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER || ""}
        />
        <GoogleAnalytics
          gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS || ""}
        />
        <HelmetProvider>
          <Helmet>
            <link
              href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css"
              rel="stylesheet"
            />
          </Helmet>
          <StyledComponentsRegistry>
            <MediaQueryProvider>
              <div id="modal-root"></div>
              <GlobalStyles />
              <ThemeProvider theme={theme}>
                <Toaster />
                {persistor && (
                  <Provider store={storeRef.current}>
                    <PersistGate loading={null} persistor={persistor}>
                      <SocketConnection
                        key={isLoggedIn ? "loggedIn" : "loggedOut"}
                      />
                      <Container>
                        <Main>
                          {isHeaderFooterShow && <Header />}
                          {children}
                        </Main>
                        {isHeaderFooterShow && (
                          <Footer isShowChat={isHeaderFooterShow} />
                        )}
                      </Container>
                    </PersistGate>
                  </Provider>
                )}
              </ThemeProvider>
            </MediaQueryProvider>
          </StyledComponentsRegistry>
        </HelmetProvider>
      </body>
    </html>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Main = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
