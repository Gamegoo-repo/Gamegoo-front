"use client";

import GlobalFont from "@/styles/GlobalFont";
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
        <GlobalFont />
        {children}
      </body>
    </html>
  );
}
