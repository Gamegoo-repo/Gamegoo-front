import { DefaultTheme } from "styled-components";

const colors = {
  white: "#ffffff",

  violet100: "#F0F0FC",
  violet200: "#DFDEFF",
  violet300: "#C1B7FF",
  violet400: "#9F90F9",
  violet500: "#7B65FF",
  violet600: "#5A42EE",
  violet700: "#452AEA",
  violet800: "#2811BA",
  violet900: "#1C0A88",

  gray100: "#F1F5FA",
  gray200: "#EDF2F8",
  gray300: "#D7DFEA",
  gray400: "#B5C1D2",
  gray500: "#9099A5",
  gray600: "#747A83",
  gray700: "#41454A",
  gray800: "#2E3032",
  gray900: "#191B1E",

  red100: "#FEF2F2",
  red400: "#FF9090",
  red500: "#FF5252",
  red600: "#F52E2E",
  red900: "#5C0E0E",

  green100: "#EAFFEF",
  green400: "#8AEA9F",
  green500: "#69D180",
  green600: "#41BF5D",
  green900: "#165524",
} as const;

interface Font {
  weight: number;
  size: number;
}

const FONT = ({ weight, size }: Font): string => {
  return `
    font-family : "Pretendard";
    font-weight : ${weight};
    font-size : ${size}px; 
    line-height : ${size * 1.5}px;
    `;
};

const fonts = {
  /*Bold*/
  bold45: FONT({
    weight: 700,
    size: 45,
  }),
  bold32: FONT({
    weight: 700,
    size: 32,
  }),
  bold25: FONT({
    weight: 700,
    size: 25,
  }),
  bold22: FONT({
    weight: 700,
    size: 22,
  }),
  bold20: FONT({
    weight: 700,
    size: 20,
  }),
  bold18: FONT({
    weight: 700,
    size: 18,
  }),
  bold16: FONT({
    weight: 700,
    size: 16,
  }),
  bold14: FONT({
    weight: 700,
    size: 14,
  }),
  bold12: FONT({
    weight: 700,
    size: 12,
  }),
  bold11: FONT({
    weight: 700,
    size: 11,
  }),
  bold10: FONT({
    weight: 700,
    size: 10,
  }),

  /*SemiBold*/
  semiBold18: FONT({
    weight: 600,
    size: 18,
  }),
  semiBold16: FONT({
    weight: 600,
    size: 16,
  }),
  semiBold15: FONT({
    weight: 600,
    size: 15,
  }),
  semiBold14: FONT({
    weight: 600,
    size: 14,
  }),
  semiBold13: FONT({
    weight: 600,
    size: 13,
  }),
  semiBold12: FONT({
    weight: 600,
    size: 12,
  }),

  semiBold10: FONT({
    weight: 600,
    size: 10,
  }),


  /*Medium*/
  medium20: FONT({
    weight: 500,
    size: 20,
  }),
  medium18: FONT({
    weight: 500,
    size: 18,
  }),
  medium16: FONT({
    weight: 500,
    size: 16,
  }),
  medium15: FONT({
    weight: 500,
    size: 15,
  }),
  medium14: FONT({
    weight: 500,
    size: 14,
  }),
  medium11: FONT({
    weight: 500,
    size: 11,
  }),

  /*Regular*/
  regular35: FONT({
    weight: 400,
    size: 35,
  }),
  regular32: FONT({
    weight: 400,
    size: 32,
  }),
  regular28: FONT({
    weight: 400,
    size: 28,
  }),
  regular25: FONT({
    weight: 400,
    size: 25,
  }),
  regular20: FONT({
    weight: 400,
    size: 20,
  }),
  regular18: FONT({
    weight: 400,
    size: 18,
  }),
  regular16: FONT({
    weight: 400,
    size: 16,
  }),
  regular14: FONT({
    weight: 400,
    size: 14,
  }),
  regular13: FONT({
    weight: 400,
    size: 13,
  }),
  regular12: FONT({
    weight: 400,
    size: 12,
  }),
  regular9: FONT({
    weight: 400,
    size: 9,
  }),
  regular8: FONT({
    weight: 400,
    size: 8,
  }),

  light32: FONT({
    weight: 300,
    size: 32,
  }),
};

export type ColorsTypes = typeof colors;
export type FontsTypes = typeof fonts;

export const theme: DefaultTheme = {
  colors,
  fonts,
};
