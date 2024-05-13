"use client";

import Header from "@/components/common/Header";
import { theme } from "@/styles/theme";
import styled from "styled-components";

export default function Home() {
  return (
    <>
      <Example>Gamegoo Initial settings</Example>
    </>
  );
}

const Example = styled.div`
  margin-top: 60px; // hearder용 margin (test)
  color: ${theme.colors.purple100};
  ${(props) => props.theme.fonts.bold32};
`;
