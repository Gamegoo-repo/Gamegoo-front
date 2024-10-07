import { theme } from "@/styles/theme";
import Image from "next/image";
import styled, { css } from "styled-components";
import ChevronDownIcon from "../../../public/assets/icons/chevron_down.svg";
import BlindProfile from "../user/BlindProfile";

const levelColors = [
  theme.colors.purple400,
  theme.colors.purple300,
  theme.colors.purple200,
  theme.colors.purple100,
  theme.colors.gray700,
];

interface MannerLevelBarProps {
  recentLevel?: number;
  mannerRank?: number;
  isBlind?: boolean;
}

const MannerLevelBar = (props: MannerLevelBarProps) => {
  const { recentLevel, mannerRank, isBlind = false } = props;

  return (
    <Container>
      <Bar>
        <PurpleBar $isBlind={isBlind} />
        <BlackBar $isBlind={isBlind} />
      </Bar>
      <Check>
        {[1, 2, 3, 4, 5].map((level) => (
          <LevelBox key={level} level={level - 1}>
            {recentLevel === level && (
              <Recent>
                {mannerRank && (
                  <Percentage>{`상위 ${
                    mannerRank || 0
                  }% 의 매너레벨`}</Percentage>
                )}
                <DownIconWrapper level={level - 1}>
                  <ChevronDownIcon />
                </DownIconWrapper>
              </Recent>
            )}
            <Level
              bold={recentLevel === level}
              $isBlind={isBlind}
            >{`Lv ${level}`}</Level>
            <ImageWrapper>
              <Image
                src={
                  isBlind
                    ? level <= 1
                      ? "/assets/icons/check_level_blind.svg"
                      : "/assets/icons/check_level_blind_ring.svg"
                    : `/assets/icons/check_level${level}.svg`
                }
                alt={`check_level${level}`}
                width={isBlind ? (level > 1 ? 17 : 39) : level === 5 ? 17 : 39}
                height={isBlind ? (level > 1 ? 17 : 39) : level === 5 ? 17 : 39}
                style={{
                  ...(isBlind === false && {
                    marginBottom: level === 5 ? "0px" : undefined,
                  }),
                }}
              />
            </ImageWrapper>
          </LevelBox>
        ))}
      </Check>
    </Container>
  );
};

export default MannerLevelBar;

const Container = styled.div`
  width: 100%;
  height: 90px;
  position: relative;
  display: flex;
  justify-content: flex-end;
`;

const Bar = styled.div`
  width: calc(100% - 25px);
  height: 3.8px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 17px;
  left: 0;
`;

const PurpleBar = styled.div<{ $isBlind: boolean }>`
  width: 80%;
  height: 3.8px;
  background: linear-gradient(90deg, #dbd6fe 0%, #5a42ee 100%);
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      background: ${theme.colors.gray700};
    `}
`;

const BlackBar = styled.div<{ $isBlind: boolean }>`
  width: 20%;
  height: 3.8px;
  background: #606060;
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      background: ${theme.colors.gray700};
    `}
`;

const Check = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  bottom: 0;
  left: 0;
`;

const LevelBox = styled.div<{ level: number }>`
  display: flex;
  width: 39px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: ${(props) => levelColors[props.level]};
  position: relative;
`;

const Recent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
`;

const Percentage = styled.div`
  ${(props) => props.theme.fonts.bold11};
  height: 11px;
`;

const DownIconWrapper = styled.div<{ level: number }>`
  width: 10px;
  height: 12px;
  path {
    fill: ${(props) => levelColors[props.level]};
    transform: scale(1.42857);
  }
  svg {
    width: 10px;
    height: 10px;
  }
`;

const Level = styled.div<{ bold: boolean; $isBlind: boolean }>`
  ${(props) =>
    props.bold ? props.theme.fonts.bold14 : props.theme.fonts.regular14};
  margin-bottom: 5px;
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      color: ${theme.colors.gray700};
    `}
`;

const ImageWrapper = styled.div`
  width: 39px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
