"use client";

import GlobalStyles from "@/styles/GlobalStyles";
import styled, { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";
import StyledComponentsRegistry from "@/libs/registry";
import { Provider } from "react-redux";
import { useEffect, useRef } from "react";
import { AppStore, RootState, store } from "@/redux/store";
import { usePathname } from "next/navigation";
import SocketConnection from "@/components/socket/SocketConnection";
import { Toaster } from "react-hot-toast";
import { connectSocket } from "@/socket";
import Footer from "@/components/common/Footer";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
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

  const isUser = (state: RootState) => state.user;

  /* 로그인 이전 소켓 연결 */
  useEffect(() => {
    connectSocket();
  }, []);

  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <div id="modal-root"></div>
          <GlobalStyles />
          <ThemeProvider theme={theme}>
            <Toaster />
            <Provider store={storeRef.current}>
              <SocketConnection />
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
      </body>
    </html>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
