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
  padding-top: 70px;
}

a {
  color: inherit;
  text-decoration: none;
}

ol,
ul {
  list-style: none;
}

button {
  border: none;
  background: transparent;
  cursor:pointer;
}


@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'); 
  }
`;

export default GlobalStyles;