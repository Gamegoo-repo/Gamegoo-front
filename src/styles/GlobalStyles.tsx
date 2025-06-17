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
  /* min-width: 1200px; */
  font-family: "Pretendard", sans-serif;
  white-space: pre-line;
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 26px;
    background: ${theme.colors.gray500};
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

img {
  -webkit-user-drag: none;
  user-select: none;
}


@font-face {
    font-family: "Pretendard";
    src: url("/public/assets/fonts/PretendardVariable.woff2") format('font-woff2'),
    url("/assets/fonts/PretendardVariable.ttf") format('truetype'); 
  }
/* 새로 추가한 Time For Salad */
@font-face {
  font-family: "TimeForSalad";
  src: url("/assets/fonts/TimeForSalad.woff2") format("woff2"),
       url("/assets/fonts/TimeForSalad.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
`;

export default GlobalStyles;
