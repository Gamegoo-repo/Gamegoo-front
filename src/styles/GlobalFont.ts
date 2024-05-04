import { createGlobalStyle } from "styled-components";

const GlobalFont = createGlobalStyle`    
  @font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export default GlobalFont;
