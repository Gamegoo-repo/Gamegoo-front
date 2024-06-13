import { DefaultTheme } from "styled-components";

const colors = {
    white: "#fff",
    black: "#393939",

    purple100: "#5A42EE",
    purple200: "#9F90F9",
    purple300: "#C1B7FF",
    purple400: "#E3DEFF",
    purple500: "#F2F0FC",

    gray100: "#393939",
    gray200: "#8C8C96",
    gray300: "#C5C5C7",
    gray400: "#E2E2E2",
    gray500: "#F7F7F9",

    error100: "#FF5252",
    error200: "#FF7474",
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
    `
}

const fonts = {
    /*Bold*/
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
        size: 25,
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
    semiBold14: FONT({
        weight: 600,
        size: 14,
    }),

    /*Regular*/
    regular35: FONT({
        weight: 400,
        size: 35,
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
    regular12: FONT({
        weight: 400,
        size: 12,
    }),
    regular11: FONT({
        weight: 500,
        size: 11,
    }),

    /*Medium*/
    medium16: FONT({
        weight: 500,
        size: 16,
    }),
    medium14: FONT({
        weight: 500,
        size: 14,
    }),
}

export type ColorsTypes = typeof colors;
export type FontsTypes = typeof fonts;

export const theme: DefaultTheme = {
    colors,
    fonts,
}