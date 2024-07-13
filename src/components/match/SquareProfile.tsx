import { POSITIONS } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React, { useState } from "react";
import styled from "styled-components";
import Mic from "../readBoard/Mic";
import Box from "../common/Box";
import MannerLevelBox from "../common/MannerLevelBox";
import MannerLevel from "../common/MannerLevel";

interface SquareProfileProps {
  opponent?: boolean;
}

const SquareProfile: React.FC<SquareProfileProps> = ({ opponent = false }) => {
  const [mannerPopup, setMannerPopup] = useState<boolean>(false);

  const handleMannerLevel = () => {
    setMannerPopup(!mannerPopup);
  };

  return (
    <Container opponent={opponent}>
      <Column>
        <Top>
          유니콘의 비밀
          <Rank>
            <Image
              src="/assets/images/rank_b3.svg"
              width={43}
              height={43}
              alt="B3"
            />
            B3
          </Rank>
        </Top>
        <ImageContainer>
          <Image
            src="/assets/images/profile.svg"
            width={144}
            height={144}
            alt="프로필"
          />
          {opponent && (
            <>
              <Level onClick={handleMannerLevel}>LV. 5</Level>
              {mannerPopup && <MannerLevelBox top="20px" right="-17%" />}
              <Bubble>클릭해서 매너키워드 보기</Bubble>
            </>
          )}
        </ImageContainer>
        <Mic status={0} />
        <RowBox>
          <Box shape="round" text="원챔러" />
          <Box shape="round" text="승급 뿌셔" />
        </RowBox>
        <Row>
          <Position>
            {POSITIONS.slice(0, 2).map((position, index) => (
              <Posi key={index}>
                {position.label}
                <Image
                  src={`/assets/icons/position_${position.position}_purple.svg`}
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
                {position.label}
                <Image
                  src={`/assets/icons/position_${position.position}_purple.svg`}
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

const Container = styled.div<{ opponent: boolean }>`
  width: 100%;
  height: 580px;
  padding: 30px 40px;
  border-radius: 30px;
  border: 1px solid
    ${({ opponent }) =>
      opponent ? theme.colors.purple100 : theme.colors.gray400};
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
    border-bottom: 9px solid #9F90F9;
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
    border-bottom: 9px solid #E3DEFF;
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
