import Image from "next/image";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Box from "../common/Box";
import Toggle from "../common/Toggle";
import { theme } from "@/styles/theme";
import SelectedStylePopup from "./SelectedStylePopup";
import { css } from "styled-components";
import { GAME_STYLE } from "@/constants/profile";
import { useDispatch } from "react-redux";
import { updateGameStyles } from "@/redux/slices/matchInfo";
import { setUserMike } from "@/redux/slices/userSlice";
import { putGameStyle, putMike } from "@/api/user/profile/put";
import { Mike } from "@/types/user/mike";
import useMediaQueries from "@/hooks/useMediaQueries";
type profileType = "me" | "other" | "none" | "mini";

interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

interface GameStyleProps {
  gameStyleResponseDTOList: GameStyle[];
  profileType: profileType;
  mike: Mike;
  handleMike?: () => void;
}

const GameStyle = (props: GameStyleProps) => {
  const {
    gameStyleResponseDTOList,
    profileType = "none",
    mike,
    handleMike,
  } = props;

  const isMobile = useMediaQueries({ breakpoint: 700 });
  const dispatch = useDispatch();
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<number[]>(
    gameStyleResponseDTOList.map((style) => style.gameStyleId)
  );
  const [mikeState, setMikeState] = useState(mike);

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
  }, [selectedStyles]);

  const selectedStyleObjects = selectedStyles
    .map((styleId) => GAME_STYLE.find((style) => style.gameStyleId === styleId))
    .filter(Boolean);

  const handleChangeMike = async () => {
    const newMikeValue =
      mikeState === "AVAILABLE" ? "UNAVAILABLE" : "AVAILABLE";
    setMikeState(newMikeValue);

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
          {selectedStyleObjects.map((style) => (
            <Box
              key={style!.gameStyleId}
              text={style!.gameStyleName}
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
                  src={"/assets/icons/plus_violet.svg"}
                  width={
                    profileType === "mini"
                      ? 11
                      : profileType === "none"
                      ? 14
                      : 21
                  }
                  height={
                    profileType === "mini"
                      ? 11
                      : profileType === "none"
                      ? 14
                      : 21
                  }
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
      {profileType === "mini" && (
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
  color: ${theme.colors.gray600};
  ${theme.fonts.semiBold14};

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 6px;
    `}
  @media (max-width: 700px) {
    ${theme.fonts.medium11};
  }
`;

const GameBox = styled.div<{ $profileType: profileType }>`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 6px;
    `}

  @media (max-width: 700px) {
    gap: 4px;
  }
`;

const Div = styled.div`
  width: 56px;
  height: 36px;
  border-radius: 25px;
  @media (max-width: 700px) {
    width: 38px;
    height: 29px;
  }
`;

const AddGameStyle = styled.button<{ $profileType: profileType }>`
  display: flex;
  width: 62px;
  height: 50px;
  padding: 13px 30px;
  justify-content: center;
  align-items: center;
  border-radius: 999px;
  background: ${theme.colors.white};
  outline: none;

  ${({ $profileType }) =>
    $profileType === "none" &&
    css`
      width: 56px;
      height: 36px;
      padding: 10px 13px;
    `}

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: 32px;
      height: 25px;
      padding: 5px 17px;
      font-size: 12px;
    `}

    @media (max-width: 700px) {
    width: 38px;
    height: 29px;
  }
`;
