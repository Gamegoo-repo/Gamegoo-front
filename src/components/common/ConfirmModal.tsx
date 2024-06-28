import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";

interface ConfirmModalProps {
  type: "yesOrNo" | "confirm" | "img";
  children?: string | React.ReactNode;
  width: string;
  borderRadius?: string;
  onCheck?: () => void;
  onClose: () => void;
}
const ConfirmModal = (props: ConfirmModalProps) => {
  const { type, children, width, borderRadius, onCheck, onClose } = props;
  const [mannerStatus, setMannerStatus] = useState(false);
  const [badMannerStatus, setBadMannerStatus] = useState(false);

  const handleMannerEvaluate = () => {
    setMannerStatus((prevState) => !prevState);
    setBadMannerStatus(false);
  };

  const handleBadMannerEvaluate = () => {
    setBadMannerStatus((prevState) => !prevState);
    setMannerStatus(false);
  };

  return (
    <Overlay>
      <Wrapper
        $width={width}
        $borderRadius={borderRadius || "11px"}
        onClick={(e) => e.stopPropagation()}
      >
        <Main>
          {type === "img" ? (
            <ImageTop>
              <CloseButton>
                <Image
                  onClick={onClose}
                  src="/assets/icons/close.svg"
                  width={10}
                  height={10}
                  alt="close button"
                />
              </CloseButton>
              <ImageWrapper>
                <ClickArea onClick={handleMannerEvaluate}>
                  <Image
                    src={
                      mannerStatus
                        ? "/assets/icons/clicked_smile.svg"
                        : "/assets/icons/smile.svg"
                    }
                    width={33}
                    height={33}
                    alt="smile icon"
                  />
                  <MannerText>매너 평가하기</MannerText>
                </ClickArea>
                <ClickArea onClick={handleBadMannerEvaluate}>
                  <Image
                    src={
                      badMannerStatus
                        ? "/assets/icons/clicked_sad.svg"
                        : "/assets/icons/sad.svg"
                    }
                    width={33}
                    height={33}
                    alt="sad icon"
                  />
                  <MannerText>비매너 평가하기</MannerText>
                </ClickArea>
              </ImageWrapper>
            </ImageTop>
          ) : (
            <TextTop>{children}</TextTop>
          )}
        </Main>
        <Footer>
          <Buttons>
            <Button
              onClick={onCheck || onClose}
              className={type === "img" ? undefined : "noButton"}
              disabled={type === "img" && !mannerStatus && !badMannerStatus}
              $type={type}
            >
              {type === "yesOrNo" ? "예" : "확인"}
            </Button>
            {type === "yesOrNo" && (
              <Button onClick={onClose} className="noButton" $type={type}>
                아니요
              </Button>
            )}
          </Buttons>
        </Footer>
      </Wrapper>
    </Overlay>
  );
};

export default ConfirmModal;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  inset: 0;
  z-index: 100;
`;

const Wrapper = styled.div<{ $width: string; $borderRadius: string }>`
  width: ${(props) => props.$width};
  background: ${theme.colors.white};
  border-radius: ${(props) => props.$borderRadius};
  box-shadow: 0 0 14.76px 0 rgba(0, 0, 0, 0.15);
`;

const Main = styled.main`
  padding: 0 4px;
`;

const ImageTop = styled.div`
  border-bottom: 0.58px solid rgba(197, 197, 199, 1);
`;

const TextTop = styled.div`
  min-height: 189px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-bottom: 0.58px solid rgba(197, 197, 199, 1);
`;

const CloseButton = styled.p`
  display: flex;
  padding: 13px 15px 0;
  margin-bottom: 5px;
  img {
    margin-left: auto;
    cursor: pointer;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin-bottom: 15px;
`;

const ClickArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const MannerText = styled.p`
  ${(props) => props.theme.fonts.regular14};
  color: #2d2d2d;
  margin-top: 11px;
`;

const Footer = styled.footer``;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<{ $type: string }>`
  text-align: center;
  ${({ $type }) =>
    $type === "img" ? `${theme.fonts.bold11}` : `${theme.fonts.semiBold18}`};
  cursor: pointer;
  color: ${({ $type }) => ($type === "img" ? "#2D2D2D" : "#44515C")};
  width: 100%;
  padding: 15px 0;
  &:disabled {
    color: ${theme.colors.gray300};
  }

  &.noButton {
    border-radius: 0 0 11px 0;
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.purple100};
      background: ${theme.colors.gray500};
    }
  }
`;
