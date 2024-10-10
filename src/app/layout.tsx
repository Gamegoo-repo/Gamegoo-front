"use client";

import GlobalStyles from "@/styles/GlobalStyles";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";
import StyledComponentsRegistry from "@/libs/registry";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { AppStore, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import SocketConnection from "@/components/socket/SocketConnection";
import { Toaster } from "react-hot-toast";
import { connectSocket, socket } from "@/socket";
import { HelmetProvider, Helmet } from "react-helmet-async";
import Footer from "@/components/common/Footer";
import { getAccessToken } from "@/utils/storage";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  if (!storeRef.current) {
    storeRef.current = store();
  }

  const pathname = usePathname();
  const isNotFoundPage = pathname === "/404" || pathname === "/not-found";
  const isHeader = !(
    isNotFoundPage ||
    pathname === "/login" ||
    pathname.includes("/join") ||
    pathname.includes("/password")
  );

  useEffect(() => {
    if (!socket) {
      connectSocket();
      sessionStorage.removeItem('logout');
    }
  }, []);

  /* 로그인 상태 변경 시 리렌더링 트리거 */
  /* 로그아웃 후 재로그인 시 SocketConnection 컴포넌트가 리렌더링되지 않아서 만듦 */
  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  }, [pathname]);

  return (
    <html>
      <head>
        <title>롤 실시간 듀오 매칭 - GAMEGOO</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <HelmetProvider>
          <Helmet>
            <link
              href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css"
              rel="stylesheet"
            />
          </Helmet>
          <StyledComponentsRegistry>
            <div id="modal-root"></div>
            <GlobalStyles />
            <ThemeProvider theme={theme}>
              <Toaster />
              <Provider store={storeRef.current}>
                <SocketConnection key={isLoggedIn ? 'loggedIn' : 'loggedOut'} />
                <Container>
                  <Main>
                    {isHeader && <Header />}
                    {children}
                  </Main>
                  <Footer />
                </Container>
              </Provider>
            </ThemeProvider>
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
