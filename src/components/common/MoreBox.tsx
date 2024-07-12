import { theme } from "@/styles/theme";
import React from "react";
import styled from "styled-components";

interface MoreBoxProps {
  text1: string;
  text2: string;
  handleFirst: () => void;
  handleSecond: () => void;
  top?: string;
}
const MoreBox = (props: MoreBoxProps) => {
  const { text1, text2, top, handleFirst, handleSecond } = props;

  return (
    <ReportBox top={top}>
      <ReportText onClick={handleFirst}>{text1}</ReportText>
      <Bar />
      <ReportText onClick={handleSecond}>{text2}</ReportText>
    </ReportBox>
  );
};

export default MoreBox;

const ReportBox = styled.div<{ top?: string }>`
  width: 175px;
  height: 84px;
  position: absolute;
  top: ${(props) => (props.top ? props.top : "-10px")};
  left: 45px;
  z-index: 100;
  box-shadow: 0 0 21.3px 0 #00000026;
  background: ${theme.colors.white};
  border-radius: 10px;
`;

const ReportText = styled.p`
  padding: 10px 20px;
  ${(props) => props.theme.fonts.medium15};
  color: #606060;
  white-space: nowrap;
  cursor: pointer;
`;

const Bar = styled.div`
  width: 100%;
  height: 1px;
  background: ${theme.colors.gray400};
`;
