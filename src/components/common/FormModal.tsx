import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import { FormEvent } from "react";

interface FormModalProps {
  type: "checkbox" | "text";
  position?: "manner";
  title: string;
  width: string;
  height?: string;
  closeButtonWidth: number;
  closeButtonHeight: number;
  borderRadius: string;
  children: string | React.ReactNode;
  onClose: () => void;
  disabled?: boolean;
}

const FormModal = (props: FormModalProps) => {
  const {
    type,
    position,
    title,
    width,
    height,
    closeButtonWidth,
    closeButtonHeight,
    borderRadius,
    children,
    onClose,
  } = props;

  return (
    <Overlay $position={position}>
      <Wrapper
        $type={type}
        $width={width}
        $height={height}
        $borderRadius={borderRadius}
      >
        <Header $type={type}>
          {type === "checkbox" && <CheckboxTitle>{title}</CheckboxTitle>}
          <CloseButton>
            <CloseImage
              onClick={onClose}
              src="/assets/icons/close.svg"
              width={closeButtonWidth}
              height={closeButtonHeight}
              alt="close button"
            />
          </CloseButton>
        </Header>
        <Main>
          <TitleContent>
            {type === "text" && <TextTitle>{title}</TextTitle>}
          </TitleContent>
          <MainContent $type={type}>{children}</MainContent>
        </Main>
      </Wrapper>
    </Overlay>
  );
};

export default FormModal;

const Overlay = styled.div<{ $position: "manner" | undefined }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: #0000009c;
  position: ${({ $position }) =>
    $position === "manner" ? "absolute" : "fixed"};
  top: ${({ $position }) => ($position === "manner" ? "50%" : "unset")};
  left: ${({ $position }) => ($position === "manner" ? "50%" : "unset")};
  transform: ${({ $position }) =>
    $position === "manner" ? "translate(-50%,-50%)" : "unset"};
  inset: 0;
  z-index: 100;
  overflow: hidden;
`;

const Wrapper = styled.div<{
  $type: string;
  $width: string;
  $height: string | undefined;
  $borderRadius: string;
}>`
  box-shadow: 0 0 21.3px 0 rgba(0, 0, 0, 0.15);
  background: ${theme.colors.white};
  max-width: ${({ $width }) => $width};
  width: 100%;
  max-height: ${({ $height }) => $height};
  height: ${({ $height }) => ($height ? "100%" : "auto")};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  padding: ${({ $type }) =>
    $type === "checkbox" ? "26px 31px 22px" : "29px 37px 38px"};
`;

const Header = styled.header<{ $type: string }>`
  display: ${({ $type }) => ($type === "checkbox" ? "flex" : "block")};
  align-items: center;
  justify-content: space-between;
`;

const CheckboxTitle = styled.p`
  ${(props) => props.theme.fonts.bold22};
  color: ${theme.colors.black};
`;

const CloseButton = styled.p`
  display: flex;
`;

const CloseImage = styled(Image)`
  margin-left: auto;
  cursor: pointer;
`;

const Main = styled.main``;

const TitleContent = styled.div``;

const MainContent = styled.div<{ $type: string }>`
  margin: ${({ $type }) => ($type === "checkbox" ? "20px 0 0" : "32px 0")};
`;
const TextTitle = styled.p`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
  text-align: center;
`;
