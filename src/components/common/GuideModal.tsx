import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Lottie from "lottie-react";
import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { theme } from "@/styles/theme";
import { lockBodyScroll, unlockBodyScroll } from "@/utils";

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const guideData = Object.freeze([
  {
    id: 1,
    title: "실시간 매칭",
    description: "원하는 조건에 맞춰 팀원을 실시간으로 매칭해 줄게요",
    checkbox: "다시보지 않기",
    animationPath: "/assets/images/preview/m1.json",
  },
  {
    id: 2,
    title: "팀원찾기 게시판",
    description: "취향에 맞는 팀원을 찾아 직접 말을 걸어보세요",
    checkbox: "다시보지 않기",
    animationPath: "/assets/images/preview/m2.json",
  },
  {
    id: 3,
    title: "매너평가 & 신고, 차단",
    description: "불편한 팀원은 다음엔 안 만날 수 있어요",
    checkbox: "다시보지 않기",
    animationPath: "/assets/images/preview/m3.json",
  },
]);

const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [animationData, setAnimationData] = useState<any>(null);

  const modalRoot = document.getElementById("modal-root") as HTMLElement;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? guideData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === guideData.length - 1 ? 0 : prev + 1));
  };

  const setCookie = (name: string, value: string, hours: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const handleClose = () => {
    if (dontShowAgain) {
      setCookie("hideGuideModalToday", "true", 24);
    }
    unlockBodyScroll();
    onClose();
  };

  const currentData = guideData[currentIndex];

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        const response = await fetch(currentData.animationPath);
        const data = await response.json();
        setAnimationData(data);
      } catch (error) {
        console.error("Failed to load animation:", error);
      }
    };

    if (currentData.animationPath) {
      loadAnimation();
    }
  }, [currentIndex, currentData.animationPath]);

  React.useEffect(() => {
    if (isOpen) {
      lockBodyScroll();
    }
    return () => {
      unlockBodyScroll();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <Overlay onClick={handleClose}>
      <ModalWrapper onClick={(e) => e.stopPropagation()}>
        <CardContainer>
          <Card>
            <LottieWrapper>
              {animationData && (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  autoplay={true}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  rendererSettings={{
                    preserveAspectRatio: "xMidYMid slice",
                  }}
                />
              )}
            </LottieWrapper>
            {currentIndex > 0 && (
              <NavigationButton $position="left" onClick={handlePrevious}>
                <Icon
                  backgroundUrl="/assets/icons/chevron_right.svg"
                  width={24}
                  height={24}
                  style={{ transform: "rotate(180deg)" }}
                />
              </NavigationButton>
            )}
            {currentIndex < guideData.length - 1 && (
              <NavigationButton $position="right" onClick={handleNext}>
                <Icon
                  backgroundUrl="/assets/icons/chevron_right.svg"
                  width={24}
                  height={24}
                />
              </NavigationButton>
            )}
          </Card>
          <ContentSection>
            <Title>{currentData.title}</Title>
            <Description>{currentData.description}</Description>
          </ContentSection>
          <BottomSection>
            <CheckboxWrapper>
              <Checkbox
                type="checkbox"
                id="dontShowAgain"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
              />
              <CheckboxLabel htmlFor="dontShowAgain">
                {currentData.checkbox}
              </CheckboxLabel>
            </CheckboxWrapper>
            <ButtonSection>
              {currentIndex === guideData.length - 1 ? (
                <ActionButton $primary onClick={handleClose}>
                  확인
                </ActionButton>
              ) : (
                <>
                  <ActionButton onClick={handleClose}>닫기</ActionButton>
                  <ActionButton $primary onClick={handleNext}>
                    다음
                  </ActionButton>
                </>
              )}
            </ButtonSection>
          </BottomSection>
        </CardContainer>
      </ModalWrapper>
    </Overlay>,
    modalRoot
  );
};

export default GuideModal;

const Overlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  inset: 0;
  z-index: ${theme.zIndex.popup};
`;

const ModalWrapper = styled.div`
  width: 480px;
  background: ${theme.colors.white};
  border-radius: 20px;
  overflow: hidden;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 320px;
  }
`;

const CardContainer = styled.div`
  position: relative;
`;

const Card = styled.div`
  height: 240px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const LottieWrapper = styled.div`
  width: 120%;
  height: 120%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;

  > div {
    width: 100% !important;
    height: 100% !important;
    min-width: 100% !important;
    min-height: 100% !important;
  }

  svg {
    width: 100% !important;
    height: 100% !important;
    min-width: 100% !important;
    min-height: 100% !important;
  }
`;

const NavigationButton = styled.button<{ $position: "left" | "right" }>`
  position: absolute;
  top: 50%;
  ${({ $position }) => $position}: 17px;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.15);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
  z-index: 10;

  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  svg {
    filter: brightness(0) invert(1);
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${({ $position }) => $position}: 12px;
  }
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 28px;
  gap: 8px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 20px;
  }
`;

const Title = styled.h2`
  ${theme.fonts.bold20};
  color: ${theme.colors.gray900};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.semiBold18};
  }
`;

const Description = styled.p`
  ${theme.fonts.regular20};
  color: ${theme.colors.gray900};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.regular18};
  }
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  ${theme.fonts.regular16};
  color: ${theme.colors.gray800};
  cursor: pointer;
`;

const ButtonSection = styled.div`
  display: flex;
  width: 100%;
  gap: 8px;
  justify-content: center;
`;

const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 12px 24px;
  border-radius: 14px;
  ${theme.fonts.semiBold18};
  cursor: pointer;
  width: 100%;

  ${({ $primary }) =>
    $primary
      ? `
    background: ${theme.colors.violet600};
    color: ${theme.colors.white};
  `
      : `
		border: 1px solid ${theme.colors.gray300};
    color: ${theme.colors.gray700};
  `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium16};
  }
`;

const BottomSection = styled.div`
  display: flex;
  padding: 28px;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  align-self: stretch;
`;
