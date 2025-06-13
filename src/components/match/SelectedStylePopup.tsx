import { GAME_STYLE } from "@/constants/profile";
import useMediaQueries from "@/hooks/useMediaQueries";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled, { css } from "styled-components";

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
}

const SelectedStylePopup: React.FC<SelectedStylePopupProps> = ({
  profileType = "none",
  onClose,
  selectedStyles,
  onSelectStyle,
  position,
}) => {
  const isMobile = useMediaQueries({ breakpoint: 700 });

  return (
    <Container $position={position} $profileType={profileType}>
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
}>`
  width: ${({ $position }) => ($position ? "574px" : "666px")};
  padding: ${({ $position }) => ($position ? "13px 22px" : "28px")};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);

  /* Background Blur */
  box-shadow: 0 4px 8.9px 0 rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);
  position: absolute;
  top: ${({ $position }) => ($position ? "-3px" : "60px")};
  left: ${({ $position }) => ($position ? "-2px" : "0")};
  z-index: 100;

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: 555px;
      height: auto;
      padding: 13px 22px;
      gap: 12px;
    `}

  @media (max-width: 700px) {
    width: 80vw;
    padding: 20px;
    gap: 12px;
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
  height: ${({ $position }) => ($position ? "29px" : "48px")};
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
