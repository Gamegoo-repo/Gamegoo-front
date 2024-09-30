import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface TermModalProps {
  title: string;
  content: string;
  onClose: () => void;
  children?: React.ReactNode;
}
const TermModal = (props: TermModalProps) => {
  const { title, content, onClose, children } = props;

  return (
    <Overlay>
      <Container>
        <Top>
          <Title>
            {!title.includes("(선택)") && <Required>*</Required>}
            <TitleText>{title}</TitleText>
          </Title>
          <Image
            src="/assets/icons/close_modal.svg"
            width={16}
            height={16}
            alt="닫기"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </Top>
        <Content>
          {content}
          {children}
        </Content>
      </Container>
    </Overlay>
  );
};

export default TermModal;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  background: #00000089;
  position: fixed;
  top: 0;
  left: 0;
`;

const Container = styled.div`
  width: 630px;
  height: 785px;
  padding: 32px 38px;
  border-radius: 30px;
  background: ${theme.colors.white};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 20px;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.gray700};
  ${theme.fonts.bold20};
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 28px 18px 28px 26px;
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-radius: 12px;
  background: ${theme.colors.gray500};
  color: #000;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 24px;
    height: 100px;
  }

  &::-webkit-scrollbar-thumb {
    /* width: 6px; */
    border-radius: 26px;
    background: ${theme.colors.gray200};
    background-clip: padding-box;
    border: 8px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const Required = styled.span`
  position: absolute;
  top: -12px;
  left: 0;
  color: ${theme.colors.error100};
  margin-right: 6px;
`;

const TitleText = styled.div`
  margin-left: 10px;
`;
