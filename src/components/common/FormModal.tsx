import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { theme } from "@/styles/theme";

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
        $borderradius={borderRadius}
      >
        <Header $type={type}>
          {type === "checkbox" && <CheckboxTitle>{title}</CheckboxTitle>}
          <CloseButton>
            <Icon
              onClick={onClose}
              backgroundUrl="/assets/icons/close.svg"
              width={closeButtonWidth}
              height={closeButtonHeight}
              style={{
                marginLeft: "auto",
                cursor: "pointer",
              }}
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
  $borderradius: string;
}>`
  box-shadow: 0 0 21.3px 0 rgba(0, 0, 0, 0.15);
  background: ${theme.colors.white};
  max-width: ${({ $width }) => $width};
  width: 100%;
  max-height: ${({ $height }) => $height};
  height: ${({ $height }) => ($height ? "100%" : "auto")};
  border-radius: ${({ $borderradius }) => $borderradius};
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
  color: ${theme.colors.gray900};
`;

const CloseButton = styled.p`
  display: flex;
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
