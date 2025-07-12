import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled, { css } from "styled-components";

import { putGameStyle, putMike } from "@/api";
import Icon from "@/components/common/Icon";
import { GAME_STYLE } from "@/constants";
import { updateGameStyles } from "@/redux/slices/matchInfo";
import { setUserMike } from "@/redux/slices/userSlice";
import { theme } from "@/styles/theme";

import { Box, Toggle } from "../common";
import SelectedStylePopup from "./SelectedStylePopup";

import type { Dispatch } from "react";
import type { Mike } from "@/types";

type profileType = "me" | "other" | "none" | "mini" | "post";

export interface GameStyle {
  gameStyleId: number;
  gameStyleName: string;
}

interface GameStyleProps {
  gameStyleResponseDTOList: GameStyle[];
  setSelectedStyleIds?: Dispatch<React.SetStateAction<number[]>>;
  profileType: profileType;
  mike?: Mike;
  handleMike?: () => void;
  label?: boolean;
}

const GameStyle = (props: GameStyleProps) => {
  const {
    gameStyleResponseDTOList,
    setSelectedStyleIds,
    profileType = "none",
    mike,
    handleMike,
    label = true,
  } = props;

  const dispatch = useDispatch();
  const [styledPopup, setStyledPopup] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<number[]>(
    gameStyleResponseDTOList.map((style) => style.gameStyleId)
  );
  const [mikeState, setMikeState] = useState(mike);
  const gameBoxRef = useRef<HTMLDivElement>(null);
  const addGameStyleRef = useRef<HTMLDivElement>(null);

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
    } else if (profileType === "post") {
      setSelectedStyleIds?.(updatedStyles);
    }
  };

  /* gameStyleResponseDTOList가 변경될 때 selectedStyles를 업데이트 */
  useEffect(() => {
    setSelectedStyles(selectedStyles);
  }, [selectedStyles]);

  const selectedStyleObjects = selectedStyles
    .map((styleId) => GAME_STYLE.find((style) => style.gameStyleId === styleId))
    .filter((style): style is GameStyle => Boolean(style));

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
        {label && "게임 스타일"}
        <GameBox ref={gameBoxRef} $profileType={profileType}>
          {selectedStyleObjects.length > 0
            ? selectedStyleObjects.map((style) => (
                <Box
                  key={style!.gameStyleId}
                  text={style!.gameStyleName}
                  shape="round"
                  profileType={profileType === "post" ? "none" : profileType}
                />
              ))
            : profileType !== "mini" &&
              profileType !== "post" && (
                <NoGameStyle>선택한 게임 스타일이 없어요</NoGameStyle>
              )}
          {profileType !== "other" && (
            <Div ref={addGameStyleRef} $profileType={profileType}>
              <AddGameStyle
                $profileType={profileType}
                onClick={handleStylePopup}
              >
                <Icon
                  backgroundUrl="/assets/icons/plus_violet.svg"
                  width={
                    profileType === "mini"
                      ? 11
                      : profileType === "none" || profileType === "post"
                        ? 14
                        : 21
                  }
                  height={
                    profileType === "mini"
                      ? 11
                      : profileType === "none" || profileType === "post"
                        ? 14
                        : 21
                  }
                />
              </AddGameStyle>
            </Div>
          )}
          {styledPopup && (
            <SelectedStylePopup
              profileType={profileType === "post" ? "none" : profileType}
              onClose={handleClosePopup}
              selectedStyles={selectedStyles}
              onSelectStyle={handleSelectStyle}
              gameBoxRef={gameBoxRef}
              addGameStyleRef={addGameStyleRef}
            />
          )}
        </GameBox>
      </LeftLabel>
      {profileType === "mini" && (
        <LeftLabel $profileType={profileType}>
          마이크
          <Toggle
            isOn={mike ? mike : "UNAVAILABLE"}
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
  flex-direction: column;
  gap: 28px;
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
      ${theme.fonts.medium14};
    `}
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium11};
  }
`;

const GameBox = styled.div<{ $profileType: profileType }>`
  width: 100%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      gap: 6px;
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 4px;
  }
`;

const NoGameStyle = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.medium14};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.medium11};
  }
`;

const Div = styled.div<{ $profileType: profileType }>`
  width: 56px;
  height: 36px;
  border-radius: 25px;

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: fit-content;
      height: fit-content;
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 38px;
    height: 29px;

    ${({ $profileType }) =>
      $profileType === "mini" &&
      css`
        width: fit-content;
        height: fit-content;
      `}
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
    ($profileType === "none" || $profileType === "post") &&
    css`
      width: 56px;
      height: 36px;
      padding: 10px 13px;
    `}

  ${({ $profileType }) =>
    $profileType === "mini" &&
    css`
      width: 44px;
      height: 29px;
      padding: 5px 15px;
      font-size: 12px;
    `}

    @media (max-width: ${theme.breakpoints.mobile}) {
    width: 38px;
    height: 29px;
  }
`;
