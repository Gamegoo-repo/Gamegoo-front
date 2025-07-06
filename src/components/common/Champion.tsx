import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { ChampionResponseDTO } from "@/types/api/champion/champion";
import useMediaQueries from "@/hooks/useMediaQueries";
import useTooltipTransformOffset from "@/hooks/useTooltipTransformOffset";

interface ChampionProps {
  title?: boolean;
  list?: ChampionResponseDTO[];
  font?: string;
  color?: string;
}

const Champion = (props: ChampionProps) => {
  const { list, font = "semiBold18", color, title = false } = props;
  const isMobile = useMediaQueries({ breakpoint: 700 });
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
      {list?.length !== 0 ? (
        <Champions>
          {list?.map((champion, key) => (
            <ChampionWrapper
              key={key}
              onMouseEnter={(e) => handleMouseEnter(key, e)}
              onMouseLeave={handleMouseLeave}
            >
              <ImageWrapper>
                <Image
                  src={`/assets/images/champion/${champion.championId}.png`}
                  width={!isMobile ? 48 : 32}
                  height={!isMobile ? 48 : 32}
                  alt={`champion-${champion.championId}`}
                  style={{
                    transform: "scale(1.2)", // 120% 확대
                    objectFit: "cover",
                  }}
                  onError={handleImageError}
                />
                <Percentage>{Math.round(champion.winRate)}%</Percentage>
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
        <NoData />
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
  height: 62px;
  position: relative;

  @media (max-width: 700px) {
    height: 45px;
  }
`;

const ImageWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;

  @media (max-width: 700px) {
    width: 33px;
    height: 33px;
  }
`;

const Percentage = styled.div`
  display: flex;
  padding: 0px 6px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 100px;
  background: ${theme.colors.violet600};
  color: ${theme.colors.white};
  text-align: center;
  ${theme.fonts.semiBold12};
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 700px) {
    width: 33px;
    height: 17px;
    padding: 0px 4px;
    ${theme.fonts.bold11};
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  z-index: 9999;
  top: 40px;
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
  z-index: 9999;

  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    bottom: -16px;
  }
`;

const ChampionName = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular18};

  @media (max-width: 700px) {
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
  @media (max-width: 700px) {
    ${theme.fonts.semiBold14};
  }
`;

const More = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular14};
`;

const NoData = styled.div`
  height: 50px;
`;
