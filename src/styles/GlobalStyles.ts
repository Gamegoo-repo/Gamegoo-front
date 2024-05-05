import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`    
:root {
    --white-color: #fff;
    --black-color-100: #000;
    --black-color-200: #222222;
    --black-color-300: #393939;

	--close-button-color #4A4A4A;

    --primary-purple-color: #5A42EE;
    
    --purple-color-100: #8E7BFF;
    --purple-color-200: #B1A5FF;
    --purple-color-300: #C1B7FF;
    --purple-color-400: #C3B9FF;
    --purple-color-500: #D1CAFF;
    --purple-color-600: #E3DEFF;
    --purple-color-700: #E8E4FF;

	--gray-color-100: #020202;
	--gray-color-200: #44515C;
	--gray-color-300: #4E4E4E;
	--gray-color-400: #565656;
	--gray-color-500: #575757;
	--gray-color-600: #5A5A5A;
	--gray-color-700: #5C5C5C;
	--gray-color-800: #737373;
	--gray-color-900: #8F8F8F;
	--gray-color-1000: #A0A0A0;
	--gray-color-1100: ##B5B5B5;
	--gray-color-1200: ##BBBBBB;
	--gray-color-1300: #D7D7D7;
	--gray-color-1400: #D9D9D9;
	--gray-color-1500: #F1F1F1;
	--gray-color-1600: #F6F6F6;
	--gray-color-1700: #F8F8F8;
        
    --font-size-large: 35px;
    --font-size-medium: 18px;
    --font-size-regular: 25px;
    --font-size-small: 16px;
    --font-size-micro: 14px;

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