import { POSITIONS } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import Mic from "../readBoard/Mic";
import Box from "../common/Box";
import MannerLevelBox from "../common/MannerLevelBox";
import { setAbbrevTier, setPositionImg } from "@/utils/custom";
import { getProfileBgColor } from "@/utils/profile";
import { toLowerCaseString } from "@/utils/string";

interface User {
  memberId: number;
  gameName: string;
  tag: string;
  tier: string;
  rank: number;
  mannerLevel: number;
  profileImg: number;
  gameMode: number;
  mainPosition: number;
  subPosition: number;
  wantPosition: number;
  mike: boolean;
  gameStyleList?: string[];
}

interface SquareProfileProps {
  opponent?: boolean;
  user: User;
}

const SquareProfile: React.FC<SquareProfileProps> = ({
  opponent = false,
  user,
}) => {
  const [mannerPopup, setMannerPopup] = useState<boolean>(false);

  const handleMannerLevel = () => {
    setMannerPopup(!mannerPopup);
  };

  if (!user) {
    return null;
  }

  return (
    <Container $opponent={opponent}>
      <Column>
        <Top>
          {user.gameName}
          <Rank>
            <object
              data={`/assets/images/tier/${
                user.tier !== "null" ? toLowerCaseString(user.tier) : "ur"
              }.svg`}
              width={43}
              height={43}
            />
            {setAbbrevTier(user.tier)}
            {user.rank ? user.rank : ""}
          </Rank>
        </Top>
        <ImageContainer>
          <ProfileImgWrapper $bgColor={getProfileBgColor(user.profileImg)}>
            <ProfileImg
              data={`/assets/images/profile/profile${user.profileImg}.svg`}
              width={100}
              height={100}
            />
          </ProfileImgWrapper>
          {opponent && (
            <>
              <Level onClick={handleMannerLevel}>LV. 5</Level>
              {mannerPopup && (
                <MannerLevelBox
                  memberId={0}
                  level={5}
                  top="20px"
                  right="-17%"
                />
              )}
              <Bubble>클릭해서 매너키워드 보기</Bubble>
            </>
          )}
        </ImageContainer>
        <Mic status={user.mike} />
        <RowBox>
          {user.gameStyleList &&
            user.gameStyleList.length > 0 &&
            user.gameStyleList
              .filter((item) => item.trim() !== "")
              .slice(0, 2)
              .map((item, index) => (
                <Box key={index} shape="round" text={item} />
              ))}
        </RowBox>
        <Row>
          <Position>
            {POSITIONS.slice(0, 2).map((position, index) => (
              <Posi key={index}>
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
          <Position>
            {POSITIONS.slice(-1).map((position, index) => (
              <Posi key={index}>
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
  );
};

export default SquareProfile;

const Container = styled.div<{ $opponent: boolean }>`
  width: 100%;
  height: 580px;
  padding: 30px 40px;
  border-radius: 30px;
  border: 1px solid
    ${({ $opponent }) =>
      $opponent ? theme.colors.purple100 : theme.colors.gray400};
  background: ${theme.colors.white};

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;

  /* 그림자 */
  box-shadow: 0px 0px 21.3px 0px rgba(0, 0, 0, 0.15);
`;

const Column = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 18px;
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
`;

const ProfileImg = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Level = styled.button`
  width: 53px;
  height: 26px;
  border-radius: 57px;
  background: rgba(0, 0, 0, 0.64);
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  color: ${theme.colors.purple300};
  ${(props) => props.theme.fonts.bold14};
  position: absolute;
  bottom: 130px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Bubble = styled.div`
  width: 140px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  border: 1px solid ${theme.colors.purple200};
  background: ${theme.colors.purple400};
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.medium11};
  position: absolute;
  bottom: 140px;
  left: 65%;

  &:before {
    border-top: 3px solid transparent;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-bottom: 9px solid #9f90f9;
    content: "";
    position: absolute;
    bottom: 0.2px;
    left: -5px;
    transform: rotate(-11deg);
    z-index: 0;
    border-radius: 0px 0px 0px 2px;
  }

  &:after {
    border-top: 0 solid transparent;
    border-left: 5.5px solid transparent;
    border-right: 4.5px solid transparent;
    border-bottom: 9px solid #e3deff;
    content: "";
    position: absolute;
    bottom: 1px;
    left: -3px;
    transform: rotate(-10deg);
    z-index: 100;
  }
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.bold25};
`;

const Rank = styled.div`
  display: flex;
  align-items: center;
  color: ${theme.colors.gray700};
  ${(props) => props.theme.fonts.regular14};
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
`;

const RowBox = styled(Row)`
  gap: 18px;
`;

const Position = styled.div`
  width: 100%;
  height: 116px;
  border-radius: 8px;
  background: var(--12, #f7f7f9);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 33px;
  font-size: ${theme.fonts.regular12};
  font-weight: 500;
  color: ${theme.colors.gray600};
`;

const Posi = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
`;
