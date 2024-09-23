import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";

interface TermModalProps {
  title: string;
  content: string;
  onClose: () => void;
}
const TermModal = (props: TermModalProps) => {
  const { title, content, onClose } = props;

  return (
    <Overlay>
      <Container>
        <Top>
          {title}
          <Image
            src="/assets/icons/close_modal.svg"
            width={16}
            height={16}
            alt="닫기"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          />
        </Top>
        <Content>{content}</Content>
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
  width: 523px;
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
  padding: 28px 18px;
  border-radius: 12px;
  background: ${theme.colors.gray500};
  color: #000;
  overflow-y: scroll;
`;
