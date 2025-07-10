import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled, { css } from "styled-components";

import { GAME_STYLE } from "@/constants";
import { useMediaQueries } from "@/hooks";
import { theme } from "@/styles/theme";

type profileType = "me" | "other" | "none" | "mini";
type positionType = "board";

interface SelectedStylePopupProps {
  profileType: profileType;
  onClose: () => void;
  selectedStyles: number[];
  onSelectStyle: (
    style: number,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  position?: positionType;
  gameBoxRef?: React.RefObject<HTMLDivElement>;
  addGameStyleRef?: React.RefObject<HTMLDivElement>;
}

const SelectedStylePopup: React.FC<SelectedStylePopupProps> = ({
  profileType = "none",
  onClose,
  selectedStyles,
  onSelectStyle,
  position,
  gameBoxRef,
  addGameStyleRef,
}) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [containerTop, setContainerTop] = useState(0);
  const [tailLeft, setTailLeft] = useState(0);

  useEffect(() => {
    const setUIOffset = () => {
      if (gameBoxRef?.current && addGameStyleRef?.current) {
        const rect = gameBoxRef.current.getBoundingClientRect();
        const addGameStyleRect =
          addGameStyleRef?.current?.getBoundingClientRect();

        setContainerTop(rect.height);
        setTailLeft(
          addGameStyleRect.left - rect.left + addGameStyleRect.width / 2 - 9
        );
      }
    };

    setUIOffset();

    window.addEventListener("resize", setUIOffset);

    return () => {
      window.removeEventListener("resize", setUIOffset);
    };
  }, [gameBoxRef, addGameStyleRef, selectedStyles]);

  return (
    <Container
      $position={position}
      $profileType={profileType}
      $containerTop={containerTop}
      $tailLeft={tailLeft}
    >
      <Top $position={position}>
        게임 스타일 선택 *최대 3개
        <CloseImage
          src="/assets/icons/close_white.svg"
          width={
            isMobile ? 16 : position ? 9 : profileType === "mini" ? 10 : 24
          }
          height={
            isMobile ? 16 : position ? 9 : profileType === "mini" ? 10 : 24
          }
          alt="close"
          onClick={onClose}
        />
      </Top>
      <Boxs $position={position} $profileType={profileType}>
        {GAME_STYLE.map((data) => (
          <Box
            $position={position}
            $profileType={profileType}
            key={data.gameStyleId}
            onClick={(e) => onSelectStyle(data.gameStyleId, e)}
            selected={selectedStyles.some((s) => s === data.gameStyleId)}
          >
            {data.gameStyleName}
          </Box>
        ))}
      </Boxs>
    </Container>
  );
};

export default SelectedStylePopup;

const Container = styled.div<{
  $position: positionType | undefined;
  $profileType: profileType;
  $containerTop: number;
  $tailLeft: number;
}>`
  width: ${({ $position }) => ($position ? "574px" : "666px")};
  padding: ${({ $position }) => ($position ? "13px 22px" : "28px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);
  top: ${({ $containerTop }) => `${$containerTop + 18}px`};
  left: 0;
  z-index: 100;

  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
  position: absolute;

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: 555px;
      height: auto;
      padding: 13px 22px;
      gap: 12px;
    `}

  /* 꼬리표 스타일 */
  &:after {
    border-top: 0 solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid rgba(0, 0, 0, 0.64);
    content: "";
    position: absolute;
    top: -17px;
    left: ${({ $tailLeft }) => $tailLeft}px;
  }

  @media (max-width: 1200px) {
    padding: 20px;
    gap: 12px;
  }
  @media (max-width: 700px) {
    width: 85vw;
    border-radius: 10px;
  }
`;

const Top = styled.div<{ $position: positionType | undefined }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  font-size: ${({ $position }) =>
    $position ? theme.fonts.regular14 : theme.fonts.bold20};

  @media (max-width: 700px) {
    ${theme.fonts.bold16}
  }
`;

const CloseImage = styled(Image)`
  cursor: pointer;
`;

const Boxs = styled.div<{
  $position: positionType | undefined;
  $profileType: profileType;
}>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ $position }) => ($position ? "9px" : "12px")};
  outline: none;

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 9px;
    `}

  @media (max-width: 700px) {
    gap: 8px;
  }
`;

const Box = styled.button<{
  selected: boolean;
  $position: positionType | undefined;
  $profileType: profileType;
}>`
  height: ${({ $position }) => ($position ? "unset" : "48px")};
  padding: 6px 20px;
  border-radius: 59.263px;
  border: 1px solid
    ${({ selected }) =>
      selected ? theme.colors.violet600 : theme.colors.gray500};
  background: ${({ selected }) => (selected ? theme.colors.violet600 : "")};
  color: ${theme.colors.gray300};
  font-size: ${({ $position }) =>
    $position ? theme.fonts.medium14 : theme.fonts.semiBold18};
  font-family: "Pretendard";

  @media (max-width: 700px) {
    padding: 6px 16px;
    height: 33px;
    font-size: ${theme.fonts.semiBold14};
  }

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      height: 29px;
      padding: 4px 16px;
      ${(props) => props.theme.fonts.semiBold14}
    `}
`;
