"use client";

import { theme } from "@/styles/theme";
import styled from "styled-components";


export default function Home() {
  return <Example>Gamegoo Initial settings</Example>;
}

const Example = styled.div`
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold32};
`;

