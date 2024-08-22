import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

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

export const TERMS = [
  {
    id: 1,
    text: (
      <div>
        <Required>*</Required>
        <Span>이용약관</Span>에 동의합니다.
      </div>
    ),
    require: true,
  },
  {
    id: 2,
    text: (
      <div>
        <Required>*</Required>
        <Span>개인정보 수집 및 이용</Span>에 동의합니다.
      </div>
    ),
    require: true,
  },
  {
    id: 3,
    text: (
      <div>
        서비스 홍보 및 마케팅 목적의{` `}
        <Span>개인정보 수집 및 이용</Span>에 동의합니다.
      </div>
    ),
    require: false,
  },
];
