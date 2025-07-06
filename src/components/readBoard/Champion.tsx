import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useEffect, useRef, useState } from "react";
import { fadeIn, fadeOut } from "@/styles/animation";
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
  const [tooltipVisible, setTooltipVisible] = useState(false);

  useEffect(() => {
    if (!isMobile) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        tooltipWrapperRef.current &&
        tooltipWrapperRef.current.contains(e.target as Node)
      ) {
        return; // 내부 클릭이면 무시
      }
      setTooltipVisible(false);
      setHoveredIndex(null);
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isMobile]);

  const handleMouseEnter = (key: number, e: React.MouseEvent) => {
    setHoveredIndex(key);

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    updateOffset(rect);

    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
    setTooltipVisible(false);
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
                <ChampionImage>
                  <Image
                    src={`/assets/images/champion/${champion.championId}.png`}
                    width={!isMobile ? 36 : 32}
                    height={!isMobile ? 36 : 32}
                    alt={`champion-${champion.championId}`}
                    style={{
                      objectFit: "cover",
                      // borderRadius: "50%",
                      transform: "scale(1.2)",
                    }}
                    onError={handleImageError}
                  />
                </ChampionImage>
                <Percentage>{Math.round(champion.winRate)}%</Percentage>
              </ImageWrapper>
              {hoveredIndex === key && (
                <TooltipWrapper
                  ref={tooltipWrapperRef}
                  visible={tooltipVisible && hoveredIndex === key}
                >
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
  gap: 6px;
`;

const ChampionWrapper = styled.div`
  width: 36px;
  height: 49px;
  position: relative; /* 기준 포인트 */

  @media (max-width: 700px) {
    width: 33px;
    height: 45px;
  }
`;

const ImageWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  position: relative; /* Percentage positioning 기준 */

  @media (max-width: 700px) {
    width: 33px;
    height: 33px;
  }
`;

const ChampionImage = styled.div`
  width: 36px;
  height: 36px;
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
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);

  @media (max-width: 700px) {
    width: 33px;
    height: 17px;
    padding: 0px 4px;
    ${theme.fonts.bold11};
    bottom: -8px;
  }
`;

const TooltipWrapper = styled.div<{ visible: boolean }>`
  position: absolute; /* 추가하여 z-index 작동 */
  animation: ${({ visible }) => (visible ? fadeIn : fadeOut)} 0.3s ease-in-out;
  z-index: 9999;
  top: 40px;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -170px;
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
`;

const TooltipTail = styled.div`
  position: absolute;
  bottom: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid rgba(0, 0, 0, 0.7);
`;

const ChampionName = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular18};
`;

const ChampionTable = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr;
  grid-template-rows: repeat(3, 1fr);
  row-gap: 6px;
  column-gap: 20px;
`;

const Head = styled.div`
  color: ${theme.colors.gray500};
  ${theme.fonts.bold14};
`;

const Rate = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.bold14};
`;

const More = styled.div`
  color: ${theme.colors.gray100};
  ${theme.fonts.regular14};
  white-space: nowrap;
`;

const NoData = styled.div`
  height: 50px;
`;
