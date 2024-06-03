"use client";
import StyledJsxRegistry from "./registry";

import GlobalStyles from "@/styles/GlobalStyles";
import { ThemeProvider } from "styled-components";
import { theme } from "@/styles/theme";
import Header from "@/components/common/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <StyledJsxRegistry>
          <GlobalStyles />
          <ThemeProvider theme={theme}>
            <Header />
            {children}
          </ThemeProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  );
}
