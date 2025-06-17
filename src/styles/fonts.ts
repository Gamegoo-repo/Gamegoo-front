import localFont from "next/font/local";

export const pretendard = localFont({
  src: [
    {
      path: "../../public/assets/fonts/PretendardVariable.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-pretendard",
  display: "swap",
});

export const timeForSalad = localFont({
  src: [
    {
      path: "../../public/assets/fonts/TimeForSalad.ttf",
      weight: "normal",
      style: "normal",
    },
  ],
  variable: "--font-timeforsalad",
  display: "swap",
});
