import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Box from "../common/Box";
import Toggle from "../common/Toggle";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "./SelectedStylePopup";
import { css } from "styled-components";
import { putGameStyle, putMike } from "@/api/user";
import { GAME_STYLE } from "@/data/profile";
import { useDispatch } from "react-redux";
import { updateGameStyles } from "@/redux/slices/matchInfo";
import { setUserMike } from "@/redux/slices/userSlice";

type profileType = "me" | "other" | "none" | "mini";

interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

interface GameStyleProps {
  gameStyleResponseDTOList: GameStyle[];
  profileType: profileType;
  mike: boolean;
  handleMike?: () => void;
}

const GameStyle = (props: GameStyleProps) => {
  const {
    gameStyleResponseDTOList,
    profileType = "none",
    mike,
    handleMike,
  } = props;

  const dispatch = useDispatch();
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<number[]>(
    gameStyleResponseDTOList.map((style) => style.gameStyleId)
  );
  const [isMike, setIsMike] = useState(mike);

  useEffect(() => {
    if (gameStyleResponseDTOList.length > 0) {
      setSelectedStyles(
        gameStyleResponseDTOList.map((style) => style.gameStyleId)
      );
    }
  }, [gameStyleResponseDTOList]);

  const handleStylePopup = () => {
    if (profileType !== "other") {
      setStyledPopup(!styledPopup);
    }
  };

  const handleClosePopup = () => {
    if (profileType !== "other") {
      setStyledPopup(false);
    }
  };

  const handleSelectStyle = async (
    style: number,
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    const isSelected = selectedStyles.includes(style);
    let updatedStyles: number[];

    if (isSelected) {
      updatedStyles = selectedStyles.filter((s) => s !== style);
    } else {
      if (selectedStyles.length < 3) {
        updatedStyles = [...selectedStyles, style];
      } else {
        updatedStyles = [...selectedStyles.slice(1), style];
      }
    }

    setSelectedStyles(updatedStyles);
    if (profileType === "me" || profileType === "mini") {
      await putGameStyle(updatedStyles);
    } else if (profileType === "none") {
      dispatch(updateGameStyles(updatedStyles));
    }
  };

  /* gameStyleResponseDTOList가 변경될 때 selectedStyles를 업데이트 */
  useEffect(() => {
    setSelectedStyles(selectedStyles);
    console.log("useEffect");
  }, [selectedStyles]);

  const selectedStyleObjects = GAME_STYLE.filter((style) =>
    selectedStyles.includes(style.gameStyleId)
  );

  const handleChangeMike = async () => {
    const newMikeValue = !isMike;
    setIsMike(newMikeValue);

    try {
      await putMike(newMikeValue);
      dispatch(setUserMike(newMikeValue));
    } catch {}
  };

  return (
    <Style>
      <LeftLabel $profileType={profileType}>
        게임 스타일
        <GameBox $profileType={profileType}>
          {selectedStyleObjects
            .filter((style) => selectedStyles.includes(style.gameStyleId))
            .map((style) => (
              <Box
                key={style.gameStyleId}
                text={style.gameStyleName}
                shape="round"
                profileType={profileType}
              />
            ))}
          {profileType !== "other" && (
            <Div>
              <AddGameStyle
                $profileType={profileType}
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
              profileType={profileType}
              onClose={handleClosePopup}
              selectedStyles={selectedStyles}
              onSelectStyle={handleSelectStyle}
            />
          )}
        </GameBox>
      </LeftLabel>
      {((profileType === "none" && handleMike) || profileType === "mini") && (
        <LeftLabel $profileType={profileType}>
          마이크
          <Toggle
            isOn={mike}
            onToggle={handleMike || handleChangeMike}
            type={profileType}
          />
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

const LeftLabel = styled.div<{ $profileType: profileType }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  ${({ $profileType }) =>
    $profileType !== "none" &&
    css`
      font: ${theme.fonts.semiBold14};
    `}
`;

const GameBox = styled.div<{ $profileType: profileType }>`
  display: row;
  display: flex;
  gap: 16px;
  position: relative;

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 6px;
    `}
`;

const Div = styled.div`
  width: 62px;
  border-radius: 25px;
`;

const AddGameStyle = styled.button<{ $profileType: profileType }>`
  display: flex;
  width: 62px;
  height: 50px;
  padding: 13px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  background: ${theme.colors.purple300};
  outline: none;

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: 32px;
      height: 25px;
      padding: 5px 17px;
      font-size: 12px;
    `}
`;
