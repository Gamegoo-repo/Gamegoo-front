import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";

interface AlertProps {
    icon: string;
    width: number;
    height: number;
    content: string;
    alt: string;
    onClose: () => void;
}

const Alert = (props: AlertProps) => {
    const { icon, width, height, content, alt, onClose } = props;

    return (
        <Overlay>
            <Wrapper>
                <TextWrapper>
                    <Image
                        src={`/assets/icons/${icon}.svg`}
                        width={width}
                        height={height}
                        alt={alt} />
                    <Text>{content}</Text>
                </TextWrapper>
                <ButtonWrapper>
                    <Button onClick={onClose}>확인</Button>
                </ButtonWrapper>
            </Wrapper>
        </Overlay>
    )
};

export default Alert;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background:#0000009C;
  inset: 0;
  z-index: 100;
`;

const Wrapper = styled.div`
  position: absolute;
  bottom:28px;  
  width: 640px;
  overflow: hidden;
`;

const TextWrapper = styled.div`
  background: ${theme.colors.white};
  border-radius:17px;
  margin-bottom: 10px;
  text-align: center;
  padding:17px 0 25px;
`;

const Text = styled.p`
  ${(props) => props.theme.fonts.bold20};
  color: ${theme.colors.gray600};
  margin-top: 18px;
`;

const ButtonWrapper = styled.div`
  background: ${theme.colors.white};
  border-radius:17px;
  text-align: center;
  padding:17px 0;
  cursor: pointer;
`;

const Button = styled.p`
  ${(props) => props.theme.fonts.regular20};
  color: ${theme.colors.gray600};
`;