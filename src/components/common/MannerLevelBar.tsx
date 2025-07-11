import Image from "next/image";
import styled, { css } from "styled-components";

import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";

import ChevronDownIcon from "../../../public/assets/icons/chevron_down.svg";

const levelColors = [
  theme.colors.violet400,
  theme.colors.violet300,
  theme.colors.violet200,
  theme.colors.violet600,
  theme.colors.gray700,
];

interface MannerLevelBarProps {
  recentLevel: number;
  mannerRank?: number | null;
  isBlind?: boolean;
}

const MannerLevelBar = (props: MannerLevelBarProps) => {
  const { recentLevel, mannerRank, isBlind = false } = props;

  const { isMobile } = useMediaQueryContext();

  return (
    <Container>
      <Bar>
        <PurpleBar $recentLevel={recentLevel} $isBlind={isBlind} />
        <BlackBar $isBlind={isBlind} />
      </Bar>
      <Check>
        {[1, 2, 3, 4, 5].map((level) => (
          <LevelBox key={level} $isColor={recentLevel === level}>
            {recentLevel === level && (
              <Recent>
                {mannerRank && (
                  <>
                    <Percentage>
                      상위
                      {mannerRank !== null &&
                      mannerRank !== undefined &&
                      mannerRank > 0
                        ? Math.floor(mannerRank)
                        : 1}
                      %
                    </Percentage>

                    <DownIconWrapper level={level - 1}>
                      <ChevronDownIcon />
                    </DownIconWrapper>
                  </>
                )}
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
                    : level === recentLevel
                      ? `/assets/icons/check_level.svg`
                      : level < recentLevel
                        ? `/assets/icons/check_level_ring${level}.svg`
                        : `/assets/icons/check_level_ring.svg`
                }
                alt={`check_level${level}`}
                width={
                  isBlind
                    ? level > 1
                      ? 17
                      : !isMobile
                        ? 39
                        : 20
                    : level !== recentLevel
                      ? 17
                      : !isMobile
                        ? 39
                        : 20
                }
                height={
                  isBlind
                    ? level > 1
                      ? 17
                      : !isMobile
                        ? 39
                        : 20
                    : level !== recentLevel
                      ? 17
                      : !isMobile
                        ? 39
                        : 20
                }
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

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 70px;
  }
`;

const Bar = styled.div`
  width: calc(100% - 30px);
  width: 100%;
  height: 3.8px;
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 17px;
  left: 15px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: 9px;
  }
`;

const PurpleBar = styled.div<{ $recentLevel: number; $isBlind: boolean }>`
  /* width: ${({ $recentLevel }) => `${($recentLevel - 1) * 25}%`}; */
  width: ${({ $recentLevel }) =>
    `calc((${($recentLevel - 1) * 25}%) - ${($recentLevel - 1) * 7.5}px)`};

  height: 3.8px;
  background: linear-gradient(90deg, #dbd6fe 0%, #5a42ee 100%);
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      background: ${theme.colors.gray700};
    `}
  position: absolute;
  z-index: 10;
`;

const BlackBar = styled.div<{ $isBlind: boolean }>`
  width: calc(100% - 30px);
  height: 3.8px;
  background: ${theme.colors.gray800};
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      background: ${theme.colors.gray700};
    `}

  position: absolute;
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

const LevelBox = styled.div<{ $isColor: boolean }>`
  display: flex;
  width: 39px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  color: ${({ theme, $isColor }) =>
    $isColor ? theme.colors.violet600 : theme.colors.gray700};
  position: relative;
  z-index: 20;
`;

const Recent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  white-space: nowrap;
`;

const Percentage = styled.div`
  ${(props) => props.theme.fonts.bold12};
  height: 11px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) => props.theme.fonts.bold9};
  }
`;

const DownIconWrapper = styled.div<{ level: number }>`
  width: 10px;
  height: 12px;
  margin-bottom: 4px;
  svg {
    width: 10px;
    height: 10px;
  }
`;

const Level = styled.div<{ bold: boolean; $isBlind: boolean }>`
  ${(props) =>
    props.bold ? props.theme.fonts.bold14 : props.theme.fonts.regular14};
  margin-bottom: ${(props) => (props.bold ? "15px" : "5px")};
  ${({ $isBlind }) =>
    $isBlind &&
    css`
      color: ${theme.colors.gray700};
    `}

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${(props) =>
      props.bold ? props.theme.fonts.bold13 : props.theme.fonts.regular13};
    margin-bottom: 0px;
  }
`;

const ImageWrapper = styled.div`
  width: 39px;
  height: 39px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: 20px;
    height: 20px;
  }
`;
