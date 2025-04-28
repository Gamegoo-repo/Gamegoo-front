import { POSITIONS } from "@/constants/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Mic from "../readBoard/Mic";
import Box from "../common/Box";
import MannerLevelBox from "../common/MannerLevelBox";
import { setAbbrevTier, setPositionImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";
import { Position as PositionType } from "@/types/position/position";
import { Mike } from "@/types/user/mike";
import useMediaQueries from "@/hooks/useMediaQueries";

interface User {
  memberId: number;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  mannerLevel: number;
  profileImg: number;
  gameMode: number;
  mainPosition: PositionType;
  subPosition: PositionType;
  wantPosition: PositionType;
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
  const isMobile = useMediaQueries({ breakpoint: 700 });
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
          <Column>
            <FirstRow>
              {user.gameName}
              <SpanTag>#{user.tag}</SpanTag>
            </FirstRow>
            <SecondRow>
              <Rank>
                <TierImage
                  data={`/assets/images/tier/${
                    user.tier !== "null"
                      ? toLowerCaseString(user.tier)
                      : "unrank"
                  }.svg`}
                  width={43}
                  height={43}
                />
                {user.tier}
              </Rank>
            </SecondRow>
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
            <Mic status={user.mike} />
            {/* TODO 게임 스타일 UI 확인 필요 */}
            <RowBox>
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
            </RowBox>
            <Row>
              <Position $opponent={opponent}>
                {/* 주 포지션, 부 포지션 */}
                {POSITIONS.slice(0, 2).map((position, index) => (
                  <Posi $opponent={opponent} key={index}>
                    {POSITIONS[index].label}
                    <Image
                      src={setPositionImg(
                        index === 0 ? user.mainPosition : user.subPosition
                      )}
                      width={39}
                      height={31}
                      alt="포지션"
                    />
                  </Posi>
                ))}
              </Position>
              <Position $opponent={opponent}>
                {/* 내가 찾는 포지션 */}
                {POSITIONS.slice(-1).map((position, index) => (
                  <Posi $opponent={opponent} key={index}>
                    {POSITIONS[2].label}
                    <Image
                      src={setPositionImg(user.wantPosition)}
                      width={39}
                      height={31}
                      alt="포지션"
                    />
                  </Posi>
                ))}
              </Position>
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
  gap: 18px;

  /* 그림자 */
  box-shadow: 0px 0px 21.3px 0px rgba(0, 0, 0, 0.15);
  @media (max-width: 700px) {
    padding: ${({ $isOpened }) =>
      $isOpened ? `10px 20px 28px 20px` : `10px 20px`};
    border-radius: 8px;
    height: unset;
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
  gap: 18px;
  @media (max-width: 700px) {
    gap: 15px;
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
  @media (max-width: 700px) {
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

const LevelTag = styled.span`
  position: absolute;
  bottom: -12.5px;
  left: 50%;
  transform: translate(-50%);
  height: 25px;
  border-radius: 57px;
  padding: 6px 10px;
  background: rgba(0, 0, 0, 0.64);

  color: ${theme.colors.violet300};
  ${theme.fonts.bold13}
  backdrop-filter: blur(7.5px);

  @media (max-width: 700px) {
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
  top: -15px;
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
  ${theme.fonts.bold25}
  color: ${theme.colors.gray800};
`;

const SpanTag = styled.span`
  ${theme.fonts.bold16}
  color: ${theme.colors.gray500};
  margin-left: 3px;
`;

const SecondRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: ${theme.colors.gray800};
  ${(props) => props.theme.fonts.bold25};

  @media (max-width: 700px) {
    flex-direction: row;
    ${(props) => props.theme.fonts.bold16};
    gap: 4px;
  }
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.gray500};
  ${(props) => props.theme.fonts.regular14};
`;

const TierImage = styled.object`
  pointer-events: none;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 9px;
`;

const RowBox = styled(Row)`
  /* gap: 18px; */
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
  ${theme.fonts.medium16};
  color: ${theme.colors.gray800};
  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    ${(props) =>
      props.$opponent ? props.theme.fonts.medium11 : props.theme.fonts.bold12};
  }
`;
