"use client";

import MypageTab from "@/components/mypage/MypageTab";
import React from "react";
import styled from "styled-components";
import useMediaQueries from "@/hooks/useMediaQueries";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });

  return !isMobile ? (
    <Section>
      <Wrapper>
        <MypageTab />
        {children}
      </Wrapper>
    </Section>
  ) : (
    <Section>{children}</Section>
  );
};

export default Layout;

const Section = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 80px;
  display: flex;
  justify-content: center;
`;
