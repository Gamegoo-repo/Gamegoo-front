import { GAME_STYLE } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";

interface SelectedStylePopupProps {
  onClose: () => void;
  selectedStyles: string[];
  onSelectStyle: (style: string) => void;
}
const SelectedStylePopup: React.FC<SelectedStylePopupProps> = ({
  onClose,
  selectedStyles,
  onSelectStyle,
}) => {
  return (
    <Container>
      <Top>
        3개까지 선택가능
        <Image
          src="/assets/icons/close_white.svg"
          width={14}
          height={14}
          alt="close"
          onClick={onClose}
        />
      </Top>
      <Boxs>
        {GAME_STYLE.map((data) => (
          <Box
            key={data.id}
            onClick={() => onSelectStyle(data.text)}
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

const Container = styled.div`
  width: 760px;
  height: 310px;
  padding: 20px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.64);

  /* Background Blur */
  box-shadow: 0px 4px 8.9px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(7.5px);

  position: absolute;
  top: 60px;
  left: 0;

  z-index: 100;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20};
`;

const Boxs = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  gap: 14px;
`;

const Box = styled.button<{ selected: boolean }>`
  display: flex;
  height: 40px;
  padding: 10px 25px;
  justify-content: center;
  align-items: center;
  border-radius: 59.263px;
  background: ${({ selected }) =>
    selected ? theme.colors.purple100 : theme.colors.gray200};
  color: ${theme.colors.white};
  ${(props) => props.theme.fonts.regular20};
`;
