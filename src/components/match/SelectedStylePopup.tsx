import { GAME_STYLE } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect } from "react";
import styled from "styled-components";

type positionType = "board";

interface SelectedStylePopupProps {
  onClose: () => void;
  selectedStyles: string[];
  onSelectStyle: (
    style: string,
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => void;
  position?: positionType;
}
const SelectedStylePopup: React.FC<SelectedStylePopupProps> = ({
  onClose,
  selectedStyles,
  onSelectStyle,
  position,
}) => {


  return (
    <Container $position={position}>
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
      <Boxs $position={position}>
        {GAME_STYLE.map((data) => (
          <Box
            $position={position}
            key={data.id}
            onClick={(e) => onSelectStyle(data.text, e)}
            selected={selectedStyles.includes(data.text)}
          >
            {data.text}
          </Box>
        ))}
      </Boxs>
    </Container>
  );
};

export default SelectedStylePopup;

const Container = styled.div<{ $position: positionType | undefined }>`
  width: ${({ $position }) => ($position ? "574px" : "796px")};
  height: ${({ $position }) => ($position ? "214px" : "310px")};
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
`;

const Top = styled.div<{ $position: positionType | undefined }>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  font-size: ${({ $position }) => ($position ? theme.fonts.regular14 : theme.fonts.regular20)};
`;

const CloseImage = styled(Image)`
  cursor: pointer;
`

const Boxs = styled.div<{ $position: positionType | undefined }>`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: ${({ $position }) => ($position ? "9px" : "14px")};
  outline: none;
`;

const Box = styled.button<{ selected: boolean, $position: positionType | undefined }>`
  display: flex;
  height: ${({ $position }) => ($position ? "29px" : "40px")};
  padding: ${({ $position }) => ($position ? "6px 20px" : "10px 25px")};
  justify-content: center;
  align-items: center;
  border-radius: 59.263px;
  background: ${({ selected }) =>
    selected ? theme.colors.purple100 : theme.colors.gray200};
  color: ${theme.colors.white};
  font-size: ${({ $position }) => ($position ? theme.fonts.medium14 : theme.fonts.regular20)};
`;
