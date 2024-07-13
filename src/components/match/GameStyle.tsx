import Image from "next/image";
import { useState } from "react";
import styled from "styled-components";
import Box from "../common/Box";
import Toggle from "../common/Toggle";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "./SelectedStylePopup";
import { css } from "styled-components";

type profileType = "me" | "other" | "none" | "mini";

interface GameStyleProps {
  gameStyle: string[];
  profileType: profileType;
  mic: boolean;
}

const GameStyle = (props: GameStyleProps) => {
  const { gameStyle, profileType = "none", mic } = props;

  const [isMike, setIsMike] = useState(mic);
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(gameStyle);

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
        <GameBox profileType={profileType}>
          {selectedStyles.map((data, index) => (
            <Box
              key={index}
              text={data}
              shape="round"
              profileType={profileType}
            />
          ))}
          {profileType !== "other" && (
            <Div>
              <AddGameStyle
                profileType={profileType}
                onClick={handleStylePopup}
              >
                <Image
                  src="/assets/icons/plus.svg"
                  width={profileType === "mini" ? 11 : 21}
                  height={profileType === "mini" ? 11 : 21}
                  alt="추가"
                />
              </AddGameStyle>
            </Div>
          )}
          {styledPopup && (
            <SelectedStylePopup
              onClose={handleClosePopup}
              selectedStyles={selectedStyles}
              onSelectStyle={handleSelectStyle}
            />
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

const GameBox = styled.div<{ profileType: profileType }>`
  display: row;
  display: flex;
  gap: 16px;
  position: relative;

  ${({ profileType }) =>
    profileType === "mini" &&
    css`
      gap: 6px;
    `}
`;

const Div = styled.div`
  width: 62px;
  border-radius: 25px;
`;

const AddGameStyle = styled.button<{ profileType: profileType }>`
  display: flex;
  width: 62px;
  height: 50px;
  padding: 13px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background: ${theme.colors.purple300};
  outline: none;

  ${({ profileType }) =>
    profileType === "mini" &&
    css`
      width: 32px;
      height: 25px;
      padding: 5px 17px;
      font-size: 12px;
    `}
`;
