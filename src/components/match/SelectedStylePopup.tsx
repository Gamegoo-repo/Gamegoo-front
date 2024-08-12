import { GAME_STYLE } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled, { css } from "styled-components";

type profileType = "me" | "other" | "none" | "mini";
type positionType = "board";

interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

interface SelectedStylePopupProps {
  profileType: profileType;
  onClose: () => void;
  selectedStyles: GameStyle[];
  onSelectStyle: (
    style: GameStyle,
    // selectedStyles: number[];
    // onSelectStyle: (
    //   style: number,
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
  return (
    <Container $position={position} $profileType={profileType}>
      <Top $position={position}>
        3개까지 선택가능
        <CloseImage
          src="/assets/icons/close_white.svg"
          width={position ? 9 : 14}
          height={position ? 9 : 14}
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
            onClick={(e) => onSelectStyle(data, e)}
            selected={selectedStyles.some(
              (s) => s.gameStyleId === data.gameStyleId
            )}
          >
            {data.gameStyleName}
            {/* <Boxs $position={position}>
        {GAME_STYLE.map((style) => (
          <Box
            $position={position}
            key={style.id}
            selected={selectedStyles.includes(style.id)}
            onClick={(e) => onSelectStyle(style.id, e)}
          >
            {style.text} */}
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
  width: ${({ $position }) => ($position ? "574px" : "885px")};
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
      width: 570px;
      height: auto;
    `}
`;

const Top = styled.div<{ $position: positionType | undefined }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  font-size: ${({ $position }) =>
    $position ? theme.fonts.regular14 : theme.fonts.regular20};
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
  gap: ${({ $position }) => ($position ? "9px" : "14px")};
  outline: none;

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 9px;
    `}
`;

const Box = styled.button<{
  selected: boolean;
  $position: positionType | undefined;
  $profileType: profileType;
}>`
  display: flex;
  height: ${({ $position }) => ($position ? "29px" : "48px")};
  padding: ${({ $position }) => ($position ? "6px 20px" : "12px 28px")};
  justify-content: center;
  align-items: center;
  border-radius: 59.263px;
  background: ${({ selected }) =>
    selected ? theme.colors.purple100 : theme.colors.gray200};
  color: ${theme.colors.white};
  font-size: ${({ $position }) =>
    $position ? theme.fonts.medium14 : theme.fonts.medium20};

  /* 프로필 미니 */
  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      height: 30px;
      padding: 8px 18px;
      ${(props) => props.theme.fonts.regular14}
    `}
`;
