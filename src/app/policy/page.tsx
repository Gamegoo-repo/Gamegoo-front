"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styled from "styled-components";

import { LoadingSpinner } from "@/components";
import { PRIVATE_TERMS, SERVICE_TERMS } from "@/constants/terms";
import { theme } from "@/styles/theme";

const PolicyPage = () => {
  const searchParams = useSearchParams();
  const params = searchParams.get("terms");
  const { title, content } =
    params === "service" ? SERVICE_TERMS : PRIVATE_TERMS;

  return (
    <Layout>
      <Title>
        <Required>*</Required>
        <TitleText>{title}</TitleText>
      </Title>
      <Content>{content}</Content>
    </Layout>
  );
};

export default function ProgressPaging() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <PolicyPage />
    </Suspense>
  );
}

const Layout = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px 0;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20};
  margin-bottom: 10px;
`;

const Required = styled.span`
  position: absolute;
  top: -12px;
  left: 0;
  color: ${theme.colors.red600};
  margin-right: 6px;
`;

const TitleText = styled.div`
  margin-left: 10px;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 28px 18px 28px 26px;
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-radius: 12px;
  background: ${theme.colors.gray200};
  color: ${theme.colors.gray900};
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 24px;
    height: 100px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 26px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 8px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;
