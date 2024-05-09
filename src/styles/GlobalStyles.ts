import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`    
:root {
    --white-color: #fff;
    --black-color: #000;
    
    --purple-color-100: #5A42EE;
    --purple-color-200: #9F90F9;
    --purple-color-300: #C1B7FF;
    --purple-color-400: #E3DEFF;
    --purple-color-500: #F2F0FC;

    --gray-color-100: #393939;
    --gray-color-200: #8C8C96;
    --gray-color-300: #C5C5C7;
    --gray-color-400: #E2E2E2;
    --gray-color-500: #F7F7F9;
        
    --error-color-100: #FF5252;
    --error-color-200: #FF7474;

    --font-size-32: 32px;
    --font-size-25: 25px;
    --font-size-20: 20px;
    --font-size-18: 18px;
    --font-size-16: 16px;
    --font-size-14: 14px;
    --font-size-11: 11px;

    --font-weight-700: 700;
    --font-weight-600: 600;
    --font-weight-500: 500;
    --font-weight-400: 400;
}

@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export default GlobalStyles;