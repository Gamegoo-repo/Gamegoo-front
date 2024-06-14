import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";
import Button from "./Button";

interface FormModalProps {
  type: "checkbox" | "text";
  title: string;
  width: string;
  height?: string;
  closeButtonWidth: number;
  closeButtonHeight: number;
  borderRadius: string;
  children: string | React.ReactNode;
  buttonText: string;
  onClose: () => void;
  disabled?: boolean;
}

const FormModal = (props: FormModalProps) => {
  const {
    type,
    title,
    width,
    height = "auto",
    closeButtonWidth,
    closeButtonHeight,
    borderRadius,
    children,
    buttonText,
    onClose,
    disabled,
  } = props;
  return (
    <Overlay>
      <Wrapper
        onClick={(e) => e.stopPropagation()}
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
        <Footer>
          <ButtonContent>
            <Button onClick={onClose} buttonType="primary" text={buttonText} />
          </ButtonContent>
        </Footer>
      </Wrapper>
    </Overlay>
  );
};

export default FormModal;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
`;

const Wrapper = styled.div<{
  $type: string;
  $width: string;
  $height: string;
  $borderRadius: string;
}>`
  box-shadow: 0 0 21.3px 0 rgba(0, 0, 0, 0.15);
  background: ${theme.colors.white};
  max-width: ${(props) => props.$width};
  width: 100%;
  max-height: ${(props) => props.$height};
  border-radius: ${(props) => props.$borderRadius};
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
  margin: ${({ $type }) => ($type === "checkbox" ? "33px 0 51px" : "32px 0")};
`;
const TextTitle = styled.p`
  ${(props) => props.theme.fonts.regular25};
  color: #44515c;
  text-align: center;
`;
const Footer = styled.footer``;

const ButtonContent = styled.p`
  text-align: center;
`;
