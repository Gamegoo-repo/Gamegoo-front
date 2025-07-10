import React, { useEffect, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";
import { getProfileBgColor } from "@/utils";

import { Box, MannerLevelBox, Mic, RankTier } from "../common";
import { PositionBox } from "../crBoard";

import type { GameMode, Mike, Position as PositionType } from "@/types";

interface User {
  memberId: number;
  gameName: string;
  tag: string;
  soloTier: string;
  freeTier: string;
  soloRank: number;
  freeRank: number;
  mannerLevel: number;
  profileImg: number;
  gameMode: GameMode;
  mainP: PositionType;
  subP: PositionType;
  wantP: PositionType[];
  mike: Mike;
  gameStyleList?: string[];
}

interface SquareProfileProps {
  opponent?: boolean;
  isToggleUI?: boolean;
  user: User;
}

const SquareProfile: React.FC<SquareProfileProps> = ({
  opponent = false,
  isToggleUI = false,
  user,
}) => {
  const { isMobile } = useMediaQueryContext();
  const [mannerPopup, setMannerPopup] = useState<boolean>(false);
  const [isOpened, setToggleOpen] = useState<boolean>(false);

  const handleToggleOpen = () => {
    setToggleOpen(!isOpened);
  };
  const handleMannerLevel = () => {
    setMannerPopup(!mannerPopup);
  };
  useEffect(() => {
    if (!isToggleUI) {
      setToggleOpen(true);
      return;
    }
    if (!isMobile) {
      setToggleOpen(true);
    } else {
      setToggleOpen(false);
    }
  }, [isMobile, isToggleUI]);

  if (!user) {
    return null;
  }

  return (
    <ContainerWrap $opponent={opponent} $isOpened={isOpened}>
      {isToggleUI && isMobile && (
        <ToggleProfile $isOpened={isOpened} onClick={handleToggleOpen}>
          <span>내 프로필</span>
          <Image
            src={
              isOpened
                ? "/assets/icons/toggle_arrow_up.svg"
                : "/assets/icons/toggle_arrow_down.svg"
            }
            width={16}
            height={16}
            alt="toggle-profile"
          />
        </ToggleProfile>
      )}
      {((isToggleUI && isMobile && isOpened) ||
        (isMobile && !isToggleUI) ||
        !isMobile) && (
        <Container $opponent={opponent}>
          <AccountInfo>
            <FirstRow>
              {user.gameName}
              <SpanTag>#{user.tag}</SpanTag>
            </FirstRow>
            <SecondRow>
              <RankTier
                type="solo"
                tier={user.soloTier}
                rank={user.soloRank}
                direct="row"
                isAbbre={isMobile}
              />
              <Bar />
              <RankTier
                type="free"
                tier={user.freeTier}
                rank={user.freeRank}
                direct="row"
                isAbbre={isMobile}
              />
            </SecondRow>
          </AccountInfo>
          <Column>
            <ImageContainer>
              <ProfileImgWrapper $bgColor={getProfileBgColor(user.profileImg)}>
                <ProfileImg
                  data={`/assets/images/profile/profile${user.profileImg}.svg`}
                  width={!isMobile ? 100 : 67}
                  height={!isMobile ? 100 : 67}
                />
                <LevelTag onClick={handleMannerLevel}>
                  LV. {user.mannerLevel}
                </LevelTag>
                {mannerPopup && (
                  <MannerLevelBox
                    memberId={user.memberId}
                    level={user.mannerLevel}
                    top="172px"
                    right="-94%"
                    tail={true}
                    onClose={() => setMannerPopup(!mannerPopup)}
                  />
                )}
                <Bubble>클릭해서 매너키워드 보기</Bubble>
              </ProfileImgWrapper>
            </ImageContainer>
            <Mic variant="icon" status={user.mike} />
            <GameStyleContainer>
              {user.gameStyleList &&
                user.gameStyleList.length > 0 &&
                user.gameStyleList
                  .filter((item) => item.trim() !== "")
                  .map((item, index) => (
                    <Box
                      key={index}
                      shape="round"
                      profileType="square"
                      text={item}
                    />
                  ))}
            </GameStyleContainer>
            <Row>
              <PositionBox
                status="matching"
                main={user.mainP || null}
                sub={user.subP || null}
                want={user.wantP || ["ANY"]}
                isEditable={false}
              />
            </Row>
          </Column>
        </Container>
      )}
    </ContainerWrap>
  );
};

export default SquareProfile;

const ContainerWrap = styled.div<{ $opponent: boolean; $isOpened: boolean }>`
  width: 100%;
  height: 580px;
  padding: 30px 40px;
  border-radius: 30px;
  border: 1px solid
    ${({ $opponent }) =>
      $opponent ? theme.colors.violet600 : theme.colors.gray400};
  background: ${theme.colors.white};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;

  /* 그림자 */
  box-shadow: 0px 0px 21.3px 0px rgba(0, 0, 0, 0.15);
  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: ${({ $isOpened }) =>
      $isOpened ? `10px 20px 28px 20px` : `10px 20px`};
    border-radius: 8px;
    height: unset;
    gap: 20px;
  }
`;

const ToggleProfile = styled.button<{ $isOpened: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  border-bottom: ${({ $isOpened }) =>
    $isOpened ? `1px solid ${theme.colors.gray300}` : "none"};
  ${(props) => props.theme.fonts.bold14};
  padding-bottom: ${({ $isOpened }) => ($isOpened ? "10px" : "0px")};
`;
const Container = styled.div<{ $opponent: boolean }>`
  width: 100%;
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 24px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    gap: 15px;
  }
`;

const AccountInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  @media (max-width: ${theme.breakpoints.mobile}) {
    /* gap: 15px; */
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  overflow-x: visible;
`;

const ProfileImgWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 144px;
  height: 144px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 84px;
    height: 84px;
  }
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LevelTag = styled.button`
  position: absolute;
  bottom: -12.5px;
  left: 50%;
  transform: translate(-50%);
  height: 25px;
  border-radius: 57px;
  padding: 5px 10px;
  background: rgba(0, 0, 0, 0.64);

  color: ${theme.colors.violet300};
  ${theme.fonts.bold13};
  line-height: 13px;
  backdrop-filter: blur(7.5px);

  @media (max-width: ${theme.breakpoints.mobile}) {
    background: ${theme.colors.gray900};
    ${theme.fonts.bold11}
    padding: 1px 8px;
    bottom: -4px;
  }
`;

const Bubble = styled.div`
  width: 140px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid ${theme.colors.violet400};
  background: ${theme.colors.gray100};
  color: ${theme.colors.gray800};
  ${theme.fonts.medium11};
  position: absolute;
  top: -10px;
  left: 20%;

  animation: fadeInOut 2s infinite;

  @keyframes fadeInOut {
    0%,
    100% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
  }

  &:before {
    top: 100%;
    left: 30%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: ${theme.colors.violet400};
    border-width: 9px;
    margin-left: -9px;
  }

  &:after {
    top: 100%;
    left: 30%;
    border: solid transparent;
    content: "";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    border-top-color: ${theme.colors.gray100};
    border-width: 7px;
    margin-left: -7px;
  }
`;

const FirstRow = styled.div`
  display: flex;
  align-items: center;
  ${theme.fonts.bold25}
  color: ${theme.colors.gray800};
  margin-bottom: 2px;
`;

const SpanTag = styled.span`
  ${theme.fonts.bold16}
  color: ${theme.colors.gray500};
  margin-left: 3px;
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 16px;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.bold25};
  margin-bottom: 16px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    flex-direction: row;
    ${(props) => props.theme.fonts.bold16};
    gap: 4px;
  }
`;

const Bar = styled.div`
  width: 1px;
  height: 12px;
  background: ${theme.colors.gray400};
`;

const Row = styled.div`
  width: 100%;
`;

const GameStyleContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
`;

const Position = styled.div<{ $opponent: boolean }>`
  width: 100%;
  height: 104px;
  padding: 16px 32px 12px 32px;
  border-radius: 8px;
  background: ${theme.colors.gray100};
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 33px;
  ${theme.fonts.semiBold13};
  color: ${theme.colors.gray800};

  @media (max-width: ${theme.breakpoints.mobile}) {
    border-radius: 6px;
    padding: 12px 20px 8px 20px;
    gap: ${({ $opponent }) => ($opponent ? "13px" : "33px")};
  }
`;

const Posi = styled.div<{ $opponent: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  white-space: nowrap;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) =>
      props.$opponent ? props.theme.fonts.medium11 : props.theme.fonts.bold12};
  }
`;
