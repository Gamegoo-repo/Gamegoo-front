import { POSITIONS } from "@/data/profile";
import { theme } from "@/styles/theme";
import Image from "next/image";
import React from "react";
import styled from "styled-components";
import Mic from "../readBoard/Mic";
import Box from "../common/Box";

const SquareProfile = () => {
  return (
    <Container>
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

const Container = styled.div`
  width: 100%;
  height: 580px;
  padding: 30px 40px;
  border-radius: 30px;
  border: 1px solid ${theme.colors.gray400};
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
  position: relative;
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
