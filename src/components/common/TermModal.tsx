import React from "react";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { theme } from "@/styles/theme";

interface TermModalProps {
  title: string;
  content: string;
  isRequired: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}
const TermModal = (props: TermModalProps) => {
  const { title, content, isRequired, onClose, children } = props;

  return (
    <Overlay>
      <Container>
        <Top>
          <Title>
            <span>{title}</span>
            {isRequired ? (
              <RequiredText>(필수)</RequiredText>
            ) : (
              <UnRequiredText>(선택)</UnRequiredText>
            )}
          </Title>
          <button onClick={onClose}>
            <Icon
              backgroundUrl={"/assets/icons/close_modal.svg"}
              width={16}
              height={16}
            />
          </button>
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
  z-index: ${theme.zIndex.popup};;
`;

const Container = styled.div`
  max-width: 523px;
  width: 100%;
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 90%;
    height: 90%;
    min-width: 300px;
    padding: 20px;
    border-radius: 8px;
    gap: 10px;
  }
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.gray800};
  ${theme.fonts.bold20};
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  padding: 28px 18px;
  display: flex;
  flex-direction: column;
  gap: 23px;
  border-radius: 12px;
  background: ${theme.colors.gray200};
  color: ${theme.colors.gray800};
  overflow-y: auto;
  overflow-x: clip;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.medium11};
    padding: 13px;
    border-radius: 8px;
  }
  &::-webkit-scrollbar {
    width: 24px;
    height: 100px;
  }

  &::-webkit-scrollbar-thumb {
    width: 6px;
    border-radius: 26px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 8px solid transparent;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Title = styled.div`
  position: relative;
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold16};
  }
  span {
    margin-right: 5px;
  }
`;

const RequiredText = styled.span`
  color: ${theme.colors.violet600};
`;

const UnRequiredText = styled.span`
  color: ${theme.colors.gray500};
`;
