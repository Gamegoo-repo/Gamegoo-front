import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import Box from "../common/Box";
import { EX_GAME_STYLE } from "@/data/profile";
import Toggle from "../common/Toggle";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "./SelectedStylePopup";

const GameStyle = () => {
  const [isMike, setIsMike] = useState(false);
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const handleMike = () => {
    setIsMike(!isMike);
  };

  const handleStylePopup = () => {
    setStyledPopup(!styledPopup);
  };

  const handleClosePopup = () => {
    setStyledPopup(false);
  };

  const handleSelectStyle = (style: string) => {
    setSelectedStyles((prevStyles) => {
      if (prevStyles.includes(style)) {
        return prevStyles.filter((s) => s! == style);
      } else if (prevStyles.length < 3) {
        return [...prevStyles, style];
      } else {
        return prevStyles;
      }
    });
  };

  return (
    <Style>
      <LeftLabel>
        게임 스타일
        <GameBox>
          {EX_GAME_STYLE.map((data) => (
            <Box key={data.id} text={data.text} shape="round" />
          ))}
          <Div>
            <AddGameStyle onClick={handleStylePopup}>
              <Image
                src="/assets/icons/plus.svg"
                width={21}
                height={21}
                alt="추가"
              />
            </AddGameStyle>
            {styledPopup && (
              <SelectedStylePopup
                onClose={handleClosePopup}
                selectedStyles={selectedStyles}
                onSelectStyle={handleSelectStyle}
              />
            )}
          </Div>
        </GameBox>
      </LeftLabel>
      <LeftLabel>
        마이크
        <Toggle isOn={isMike} onToggle={handleMike} />
      </LeftLabel>
    </Style>
  );
};

export default GameStyle;

const Style = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const LeftLabel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
`;

const GameBox = styled.div`
  display: row;
  height: 50px;
  display: flex;
  gap: 16px;
`;

const Div = styled.div`
  width: 62px;
  height: 50px;
  border-radius: 25px;
  position: relative;
`;
const AddGameStyle = styled.button`
  display: flex;
  width: 62px;
  height: 50px;
  padding: 13px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background: ${theme.colors.purple300};
`;
