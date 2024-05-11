import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`    
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100vw;
  font-family: "Pretendard";
  white-space: pre-line;
}

a {
  color: inherit;
  text-decoration: none;
}

ol,
ul {
  list-style: none;
}


@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export default GlobalStyles;