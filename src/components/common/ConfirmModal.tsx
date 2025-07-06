import { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import styled from "styled-components";

import {
  setOpenEvaluationModal,
  setOpenModal,
} from "@/redux/slices/modalSlice";
import { theme } from "@/styles/theme";

type ButtonText =
  | "취소"
  | "나가기"
  | "차단"
  | "확인"
  | "예"
  | "아니요"
  | "닫기"
  | "글 작성하기"
  | "글 보러하기"
  | "머무르기"
  | "매칭 종료"
  | "회원 탈퇴";

interface ConfirmModalProps {
  type?: "manner" | string;
  children?: string | React.ReactNode;
  width: string;
  primaryButtonText: ButtonText;
  secondaryButtonText?: ButtonText;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
}

const ConfirmModal = (props: ConfirmModalProps) => {
  const {
    type,
    children,
    width,
    primaryButtonText,
    secondaryButtonText,
    onPrimaryClick,
    onSecondaryClick,
  } = props;

  const dispatch = useDispatch();

  let buttonClassName = "";

  if (type !== "manner") {
    if (primaryButtonText && secondaryButtonText) {
      buttonClassName = "leftButton";
    } else if (primaryButtonText) {
      buttonClassName = "wholeButton";
    }
  }

  const [mannerStatusClicked, setMannerStatusClicked] = useState(false);
  const [badMannerStatusClicked, setBadMannerStatusClicked] = useState(false);

  const handleMannerEvaluate = () => {
    setMannerStatusClicked((prevState) => !prevState);
    setBadMannerStatusClicked(false);
  };

  const handleBadMannerEvaluate = () => {
    setBadMannerStatusClicked((prevState) => !prevState);
    setMannerStatusClicked(false);
  };

  const handleCheck = () => {
    dispatch(setOpenEvaluationModal());
    onPrimaryClick();
    mannerStatusClicked
      ? dispatch(setOpenModal("manner"))
      : dispatch(setOpenModal("badManner"));
  };

  return (
    <Overlay $type={type}>
      <Wrapper $width={width} $type={type} onClick={(e) => e.stopPropagation()}>
        <Main>
          {type === "manner" ? (
            <ImageTop>
              <CloseButton>
                <Image
                  onClick={onPrimaryClick}
                  src="/assets/icons/close.svg"
                  width={10}
                  height={10}
                  alt="닫기"
                />
              </CloseButton>
              <ImageWrapper>
                <ClickArea onClick={handleMannerEvaluate}>
                  <Image
                    src={
                      mannerStatusClicked
                        ? "/assets/icons/clicked_smile.svg"
                        : "/assets/icons/smile.svg"
                    }
                    width={33}
                    height={33}
                    alt="매너"
                  />
                  <MannerText>매너 평가하기</MannerText>
                </ClickArea>
                <ClickArea onClick={handleBadMannerEvaluate}>
                  <Image
                    src={
                      badMannerStatusClicked
                        ? "/assets/icons/clicked_sad.svg"
                        : "/assets/icons/sad.svg"
                    }
                    width={33}
                    height={33}
                    alt="비매너"
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
          <ButtonWrapper>
            <Button
              onClick={type ? handleCheck : onPrimaryClick}
              className={buttonClassName}
              disabled={
                type === "manner" &&
                !mannerStatusClicked &&
                !badMannerStatusClicked
              }
              $type={type}
              $isRed={type === "withDrawer"}
            >
              {primaryButtonText}
            </Button>
            {secondaryButtonText && onSecondaryClick && (
              <Button
                onClick={onSecondaryClick}
                className="rightButton"
                $type={type}
                disabled={
                  type === "manner" &&
                  !mannerStatusClicked &&
                  !badMannerStatusClicked
                }
              >
                {secondaryButtonText}
              </Button>
            )}
          </ButtonWrapper>
        </Footer>
      </Wrapper>
    </Overlay>
  );
};

export default ConfirmModal;

const Overlay = styled.div<{ $type: string | undefined }>`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: #0000009c;
  border-radius: ${({ $type }) => ($type === "manner" ? "20px" : "unset")};
  inset: 0;
  z-index: 101;
`;

const Wrapper = styled.div<{ $width: string; $type: string | undefined }>`
  width: ${({ $width }) => $width};
  background: ${theme.colors.white};
  border-radius: ${({ $type }) => ($type === "manner" ? "10px" : "20px")};
  box-shadow: 0 0 14.76px 0 rgba(0, 0, 0, 0.15);
  overflow: hidden;
  @media (max-width: 700px) {
    width: 90vw;
  }
`;

const Main = styled.main`
  padding: 0 4px;
  @media (max-width: 700px) {
    padding: 0;
  }
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
  border-bottom: 0.58px solid ${theme.colors.gray400};
  ${(props) => props.theme.fonts.regular25};
  color: ${theme.colors.gray800};

  @media (max-width: 700px) {
    min-height: 124px;
    ${theme.fonts.medium14}
  }
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

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button<{
  $type: string | undefined;
  $isRed?: boolean;
}>`
  text-align: center;
  ${({ $type }) =>
    $type === "manner" ? `${theme.fonts.bold11}` : `${theme.fonts.semiBold18}`};
  cursor: pointer;
  color: ${({ $type, $isRed }) =>
    $type === "manner"
      ? theme.colors.gray600
      : $isRed
        ? theme.colors.red600
        : theme.colors.gray700};
  width: 100%;
  height: ${({ $type }) => ($type ? "none" : "79px")};
  padding: 30px 0;
  &:disabled {
    color: ${theme.colors.gray300};
  }

  &.leftButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.violet600};
      background: ${theme.colors.gray100};
      border-radius: 0 0 0 20px;
    }
  }

  &.rightButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.violet600};
      background: ${theme.colors.gray100};
      border-radius: 0 0 20px 0;
    }
  }

  &.wholeButton {
    &:hover,
    &:active,
    &:focus {
      color: ${theme.colors.violet600};
      background: ${theme.colors.gray100};
      border-radius: 0 0 20px 20px;
    }
  }

  @media (max-width: 700px) {
    padding: 20px 0;
    ${theme.fonts.semiBold14}
    height: unset
  }
`;
