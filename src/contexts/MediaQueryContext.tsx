import React, { createContext, useContext, useEffect, useState } from "react";

import { theme } from "@/styles/theme";

export interface MediaQueryContextType {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const MediaQueryContext = createContext<
  MediaQueryContextType | undefined
>(undefined);

export const MediaQueryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mobileQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.mobile})`
    );
    const tabletQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.tablet})`
    );
    const desktopQuery = window.matchMedia(
      `(max-width: ${theme.breakpoints.desktop})`
    );

    const handleChange = () => {
      setIsMobile(mobileQuery.matches);
      setIsTablet(tabletQuery.matches);
      setIsDesktop(desktopQuery.matches);
    };

    handleChange();

    mobileQuery.addEventListener("change", handleChange);
    tabletQuery.addEventListener("change", handleChange);
    desktopQuery.addEventListener("change", handleChange);

    return () => {
      mobileQuery.removeEventListener("change", handleChange);
      tabletQuery.removeEventListener("change", handleChange);
      desktopQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <MediaQueryContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MediaQueryContext.Provider>
  );
};
