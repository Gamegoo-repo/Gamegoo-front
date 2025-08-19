import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styled from "styled-components";

import { useMediaQueryContext } from "@/hooks";
import useTooltipTransformOffset from "@/hooks/useTooltipTransformOffset";
import { theme } from "@/styles/theme";

import type { ChampionResponseDTO } from "@/types/api/champion/champion";

interface ChampionProps {
  variant?: string;
  title?: boolean;
  list?: ChampionResponseDTO[];
  font?: string;
  color?: string;
}

const Champion = (props: ChampionProps) => {
  const { list = [], font = "semiBold18", color, title = false, variant } = props;
  const { isMobile } = useMediaQueryContext();
  const isSmall = isMobile || variant === "table";
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const tooltipWrapperRef = useRef<HTMLDivElement>(null);
  const { tooltipRef, offsetX, updateOffset } = useTooltipTransformOffset();

  useEffect(() => {
    if (!isMobile) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        tooltipWrapperRef.current &&
        tooltipWrapperRef.current.contains(e.target as Node)
      ) {
        return; // 내부 클릭이면 무시
      }
      setHoveredIndex(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobile]);

  const handleMouseEnter = (key: number, e: React.MouseEvent) => {
    setHoveredIndex(key);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    updateOffset(rect);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // 챔피언 이미지를 로드 실패 시 기본 이미지로
  const handleImageError = (e: any) => {
    e.target.src = "/assets/images/champion/no_champion.svg";
  };

  return (
    <Wrapper>
      {title && (
        <Title $font={font} $color={color}>
          최근 선호 챔피언
        </Title>
      )}
      {list.length > 0 ? (
        <Champions>
          {list?.slice(0, 4).map((champion, key) => (
            <ChampionWrapper
              key={key}
              onMouseEnter={(e) => handleMouseEnter(key, e)}
              onMouseLeave={handleMouseLeave}
            >
              <ImageWrapper $isSmall={isSmall}>
                <Image
                  src={`/assets/images/champion/${champion.championId}.png`}
                  width={isSmall ? 32 : 48}
                  height={isSmall ? 32 : 48}
                  alt={`champion-${champion.championId}`}
                  style={{
                    transform: "scale(1.2)", // 120% 확대
                    objectFit: "cover",
                    pointerEvents: "none",
                  }}
                  onError={handleImageError}
                />
                <Percentage $isSmall={isSmall}>{Math.round(champion.winRate)}%</Percentage>
              </ImageWrapper>
              {hoveredIndex === key && (
                <TooltipWrapper ref={tooltipWrapperRef}>
                  <TooltipTail />
                  <Tooltip
                    ref={tooltipRef}
                    style={{
                      transform: `translateX(calc(-50% + ${offsetX}px))`,
                    }}
                  >
                    <ChampionName>
                      <strong>{champion.championName}</strong>
                    </ChampionName>
                    <ChampionTable>
                      <Head>승률</Head>
                      <Rate>{Math.round(champion.winRate)}%</Rate>
                      <More>
                        {champion.wins || "0"}승{" "}
                        {champion.wins ? champion.games - champion.wins : "0"}패
                      </More>
                      <Head>KDA</Head>
                      <Rate>
                        {champion.kda
                          ? Number(champion.kda).toFixed(2)
                          : "0.00"}
                      </Rate>
                      <More>
                        {`${
                          champion.kills
                            ? Number(champion.kills).toFixed(1)
                            : "0.0"
                        } / ${
                          champion.deaths
                            ? Number(champion.deaths).toFixed(1)
                            : "0.0"
                        } / ${
                          champion.assists
                            ? Number(champion.assists).toFixed(1)
                            : "0.0"
                        }`}
                      </More>
                      <Head>CS</Head>
                      <Rate>
                        {champion.csPerMinute !== undefined
                          ? champion.csPerMinute.toFixed(1)
                          : "-"}
                      </Rate>
                      <More>
                        {champion.averageCs !== undefined
                          ? champion.averageCs.toFixed(1)
                          : "-"}
                      </More>
                    </ChampionTable>
                  </Tooltip>
                </TooltipWrapper>
              )}
            </ChampionWrapper>
          ))}
        </Champions>
      ) : (
        <NoData>챔피언 정보가 없습니다.</NoData>
      )}
    </Wrapper>
  );
};

export default Champion;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
`;

const Title = styled.p<{ $font: string; $color?: string }>`
  ${(props) =>
    props.theme.fonts[`${props.$font}` as keyof typeof props.theme.fonts]};
  color: ${({ $color, theme }) => ($color ? $color : theme.colors.gray600)};
`;

const Champions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChampionWrapper = styled.div`
  height: 45px;
  position: relative;

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 45px;
  }
`;

const ImageWrapper = styled.div<{ $isSmall: boolean }>`
  width: ${({ $isSmall }) => ($isSmall ? "33px" : "48px")};
  height: ${({ $isSmall }) => ($isSmall ? "33px" : "48px")};
  border-radius: 50%;
  overflow: hidden;
`;

const Percentage = styled.div<{ $isSmall: boolean }>`
  display: flex;
  padding: 0px 4px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: ${theme.colors.violet600};
  color: ${theme.colors.white};
  text-align: center;
  ${theme.fonts.bold11};
  position: absolute;
  bottom: ${({ $isSmall }) => ($isSmall ? "0" : "-10px")};
  left: 50%;
  transform: translateX(-50%);
  width: ${({ $isSmall }) => ($isSmall ? "33px" : "32px")};
  height: ${({ $isSmall }) => ($isSmall ? "17px" : "15px")};
`;

const TooltipWrapper = styled.div`
  position: absolute;
  z-index: ${theme.zIndex.baseFloating};
  top: 17px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -190px;
  left: 50%;
  height: 154px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: ${theme.colors.white};
  border-radius: 14px;
  ${theme.fonts.regular14};
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5.3px);
  pointer-events: none;
  text-align: left;
  z-index: ${theme.zIndex.baseFloating};

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 150px;
    bottom: -165px;
    border-radius: 10px;
    gap: 8px;
  }
`;

const TooltipTail = styled.div`
  position: absolute;
  bottom: -36px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(0, 0, 0, 0.7);

  @media (max-width: ${theme.breakpoints.mobile}) {
    bottom: -16px;
  }
`;

const ChampionName = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular18};

  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.regular16};
  }
`;

const ChampionTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 6px;
  column-gap: 10px;
  white-space: nowrap;
`;

const Head = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.bold14};
`;

const Rate = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.bold14};
  @media (max-width: ${theme.breakpoints.mobile}) {
    ${theme.fonts.semiBold14};
  }
`;

const More = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular14};
`;

const NoData = styled.div`
  display: flex;
  align-items: center;
  height: 50px;
  color: ${theme.colors.gray400};
  ${theme.fonts.medium12};
`;
