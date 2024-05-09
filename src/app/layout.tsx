"use client";

import GlobalStyles from "@/styles/GlobalStyles";
import "./globals.css";

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
        <GlobalStyles />
        {children}
      </body>
    </html>
  );
}
