import React from "react";

import styled from "styled-components";

import { theme } from "@/styles/theme";

export const createTerms = (
  openModal: (type: string, index: number) => void
) => [
  {
    id: 1,
    text: (
      <Text>
        <Span onClick={() => openModal("SERVICE", 0)}>이용 약관</Span>
        {` `}동의
        <Required $isRequired={true}>(필수)</Required>
      </Text>
    ),
    require: true,
  },
  {
    id: 2,
    text: (
      <Text>
        <Span onClick={() => openModal("PRIVATE", 1)}>개인정보 처리방침</Span>
        {` `}동의
        <Required $isRequired={true}>(필수)</Required>
      </Text>
    ),
    require: true,
  },
  {
    id: 3,
    text: (
      <Text>
        <Span onClick={() => openModal("MARKETING", 2)}>
          마케팅 목적 개인정보 수집 및 이용
        </Span>
        {` `}동의
        <Required $isRequired={false}>(선택)</Required>
      </Text>
    ),
    require: false,
  },
];

const Text = styled.div`
  color: ${theme.colors.gray700};
  ${theme.fonts.regular16};
  /* white-space: nowrap; */
`;

const Required = styled.span<{ $isRequired: boolean }>`
  color: ${({ $isRequired }) =>
    $isRequired ? theme.colors.violet800 : theme.colors.gray500};
  ${theme.fonts.regular16};
  margin-left: 4px;
`;

const Span = styled.span`
  text-decoration: underline;
  transition:
    color 200ms,
    text-decoration 500ms;

  &:hover {
    color: ${theme.colors.violet600};
  }
`;
