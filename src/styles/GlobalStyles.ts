import { createGlobalStyle } from "styled-components";
import { theme } from "./theme";

const GlobalStyles = createGlobalStyle`    
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  min-width: 1200px;
  font-family: "Pretendard", sans-serif;
  white-space: pre-line;

  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 26px;
    background: ${theme.colors.gray300};
    background-clip: padding-box;
    border: 6px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
}

a {
  color: inherit;
  text-decoration: none;
}

ol,
ul,
li {
  list-style: none;
}

button {
  cursor:pointer;
  border: none;
  background: transparent;
  cursor:pointer;
}


@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'),
    url("/assets/fonts/PretendardVariable.ttf") format('truetype'); 
  }
`;

export default GlobalStyles;