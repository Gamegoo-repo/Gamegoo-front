"use client";
import StyledJsxRegistry from "./registry";

import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";
import StyledComponentsRegistry from "@/libs/registry";
import { Provider } from "react-redux";
import { useRef } from "react";
import { AppStore, store } from "@/redux/store";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store();
  }
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
            <Provider store={storeRef.current}>
              <Header />
              {children}
            </Provider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
