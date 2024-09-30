import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

const Text = styled.div`
  color: #7c7c7c;
  ${theme.fonts.regular16};
  white-space: nowrap;
`;

const Required = styled.span`
  color: ${theme.colors.error100};
  margin-right: 6px;
`;

const Span = styled.span`
  color: ${theme.colors.purple100};
  transition: color 200ms, text-decoration 500ms;

  &:hover {
    color: ${theme.colors.purple200};
    text-decoration: underline;
  }
`;

export const createTerms = (
  openModal: (type: string, index: number) => void
) => [
  {
    id: 1,
    text: (
      <Text>
        <Required>*</Required>
        (필수){` `}
        <Span onClick={() => openModal("SERVICE", 0)}>이용약관</Span>에
        동의합니다.
      </Text>
    ),
    require: true,
  },
  {
    id: 2,
    text: (
      <Text>
        <Required>*</Required>
        (필수){` `}
        <Span onClick={() => openModal("PRIVATE", 1)}>
          개인정보 수집 및 이용
        </Span>
        에 동의합니다.
      </Text>
    ),
    require: true,
  },
  {
    id: 3,
    text: (
      <Text>
        (선택){` `}
        서비스 홍보 및 마케팅 목적의{` `}
        <Span onClick={() => openModal("MARKETING", 2)}>
          개인정보 수집 및 이용
        </Span>
        에 동의합니다.
      </Text>
    ),
    require: false,
  },
];
