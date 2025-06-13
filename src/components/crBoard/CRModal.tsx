import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { createPortal } from "react-dom";

interface BoardModalProps {
  type: "posting" | "reading";
  hideContent?: boolean;
  onClose: () => void;
  children: string | React.ReactNode;
}

const CRModal = (props: BoardModalProps) => {
  const { type, hideContent, children, onClose } = props;

  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  return createPortal(
    <Overlay $hideContent={hideContent}>
      <Wrapper $type={type} $hideContent={hideContent}>
        <Header $type={type}>
          <CloseButton $type={type}>
            <CloseImage
              onClick={onClose}
              src="/assets/icons/close.svg"
              width={24}
              height={24}
              alt="close button"
            />
          </CloseButton>
        </Header>
        <Main>
          <MainContent>{children}</MainContent>
        </Main>
      </Wrapper>
    </Overlay>,
    modalRoot
  );
};

export default CRModal;

const Overlay = styled.div<{ $hideContent: boolean | undefined }>`
  display: flex;
  justify-content: center;
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: 100;
  background: ${({ $hideContent }) => ($hideContent ? "unset" : "#0000009c")};
  overflow-y: ${({ $hideContent }) => ($hideContent ? "unset" : "scroll")};
  inset: ${({ $hideContent }) => ($hideContent ? "unset" : 0)};

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 20px;
    display: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 26px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 6px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
`;

const Wrapper = styled.div<{
  $type: string;
  $hideContent: boolean | undefined;
}>`
  border-radius: 20px;
  max-width: 580px;
  width: 100%;
  position: relative;
  min-height: ${({ $type }) => ($type === "posting" ? "837px" : "1000px")};
  max-height: ${({ $type }) => ($type === "posting" ? "837px" : "1000px")};
  height: auto;
  margin: 50px;
  padding: 48px 32px 32px 32px;
  background: ${({ $hideContent }) =>
    $hideContent ? "unset" : `${theme.colors.gray100}`};
  box-shadow: ${({ $hideContent }) =>
    $hideContent ? "unset" : "0 4px 96.4px 0 #00000040"};
  position: relative;

  /* 스크롤바 */
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 26px;
    background: ${theme.colors.gray500};
    background-clip: padding-box;
    border: 6px solid transparent;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }

  @media (max-width: 700px) {
    padding: 20.5px 20px;
    border-radius: 8px;
  }
`;

const Header = styled.header<{ $type: string }>`
  /* padding: 26px 0px 0 0; */
`;

const CloseButton = styled.p<{ $type: string }>`
  position: absolute;
  top: 17px;
  right: 14px;
  display: flex;
  margin-bottom: ${({ $type }) => ($type === "reading" ? "1px" : "8px")};
`;

const CloseImage = styled(Image)`
  margin-left: auto;
  cursor: pointer;
`;

const Main = styled.main``;

const MainContent = styled.div`
  height: 100%;
  /* padding: 0 14px; */
`;
