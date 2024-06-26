import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import Box from "../common/Box";
import Toggle from "../common/Toggle";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "./SelectedStylePopup";
import { css } from "styled-components";

type profileType = "me" | "other" | "none";

interface GameStyleProps {
  gameStyle: string[];
  profileType: profileType;
  mic: boolean;
}

const GameStyle = (props: GameStyleProps) => {
  const { gameStyle, profileType = "none", mic } = props;

  const [isMike, setIsMike] = useState(mic);
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
      <LeftLabel profileType={profileType}>
        게임 스타일
        <GameBox>
          {gameStyle.map((data, index) => (
            <Box key={index} text={data} shape="round" />
          ))}
          {profileType !== "other" && (
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
          )}
        </GameBox>
      </LeftLabel>
      {profileType === "none" && (
        <LeftLabel profileType={profileType}>
          마이크
          <Toggle isOn={isMike} onToggle={handleMike} />
        </LeftLabel>
      )}
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

const LeftLabel = styled.div<{ profileType: profileType }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  ${({ profileType }) =>
    profileType !== "none" &&
    css`
      font: ${theme.fonts.semiBold14};
    `}
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
  outline: none;
`;
