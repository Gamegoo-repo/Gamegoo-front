import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

import { GAME_STYLE } from "@/constants";
import { theme } from "@/styles/theme";

import SelectedStylePopup from "../match/SelectedStylePopup";

import type { Dispatch } from "react";

export interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}
interface GameStyleProps {
  selectedStyleIds: number[];
  setSelectedStyleIds: Dispatch<React.SetStateAction<number[]>>;
}

const GameStyle = (props: GameStyleProps) => {
  const { selectedStyleIds, setSelectedStyleIds } = props;
  const gameBoxRef = useRef<HTMLDivElement>(null);
  const addGameStyleRef = useRef<HTMLDivElement>(null);
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] =
    useState<number[]>(selectedStyleIds);
  const handleStylePopup = () => {
    setStyledPopup((prevState) => !prevState);
  };

  const handleClosePopup = () => {
    setStyledPopup(false);
  };

  const handleSelectStyle = (
    style: number,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.preventDefault();
    setSelectedStyles((prevStyles: number[]) => {
      if (prevStyles.includes(style)) {
        return prevStyles.filter((s: number) => s !== style);
      } else if (prevStyles.length < 3) {
        return [...prevStyles, style];
      } else {
        return [...prevStyles.slice(1), style];
      }
    });
  };

  useEffect(() => {
    setSelectedStyleIds(selectedStyles);
  }, [selectedStyles, setSelectedStyleIds]);

  const selectedGameStyles = selectedStyles
    .map((styleId) => GAME_STYLE.find((style) => style.gameStyleId === styleId))
    .filter((style): style is GameStyle => Boolean(style));

  return (
    <>
      <StylesWrapper ref={gameBoxRef}>
        {selectedGameStyles.map((style, index) => (
          <Content key={index}>{style.gameStyleName}</Content>
        ))}

        <Div ref={addGameStyleRef}>
          <AddGameStyle onClick={handleStylePopup}>
            <Image
              src="/assets/icons/plus_violet.svg"
              width={14}
              height={14}
              alt="추가"
            />
          </AddGameStyle>
        </Div>
        {styledPopup && (
          <SelectedStylePopup
            profileType="none"
            onClose={handleClosePopup}
            selectedStyles={selectedStyles}
            onSelectStyle={handleSelectStyle}
            position="board"
            gameBoxRef={gameBoxRef}
            addGameStyleRef={addGameStyleRef}
          />
        )}
      </StylesWrapper>
    </>
  );
};

export default GameStyle;

const StylesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 11px;
  align-items: center;
  position: relative;
`;

const Content = styled.p`
  padding: 6px 21px;
  background: ${theme.colors.white};
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.medium14};
  border-radius: 46px;
  white-space: nowrap;
  text-align: center;

  @media (max-width: 700px) {
    padding: 4px 12px;
    ${(props) => props.theme.fonts.bold12};
  }
`;

const Div = styled.div`
  border-radius: 25px;
  position: relative;
`;

const AddGameStyle = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 39px;
  height: 30px;
  padding: 4px 12px;
  border-radius: 17px;
  background: ${theme.colors.white};
  cursor: pointer;
`;
