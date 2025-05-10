import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";
import { useState } from "react";
import { fadeIn, fadeOut } from "@/styles/animation";
import { ChampionResponseDTO } from "@/types/api/champion/champion";
import useMediaQueries from "@/hooks/useMediaQueries";

interface ChampionProps {
  title?: boolean;
  list?: ChampionResponseDTO[];
  font?: string;
}

const Champion = (props: ChampionProps) => {
  const { list, font = "semiBold18", title = false } = props;
  const isMobile = useMediaQueries({ breakpoint: 700 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // 챔피언 이미지를 로드 실패 시 기본 이미지로
  const handleImageError = (e: any) => {
    e.target.src = "/assets/images/champion/no_champion.svg";
  };

  return (
    <Wrapper>
      {title && <Title $font={font}>최근 선호 챔피언</Title>}
      {list?.length !== 0 ? (
        <Champions>
          {list?.map((champion, key) => (
            <ChampionWrapper
              key={key}
              onMouseEnter={() => setHoveredIndex(key)}
              onMouseLeave={() => setHoveredIndex(null)}
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
                <Tooltip>
                  <ChampionName>
                    <strong>{champion.championName}</strong>
                  </ChampionName>
                  <ChampionTable>
                    <Head>승률</Head>
                    <Rate>{Math.round(champion.winRate)}%</Rate>
                    {/* TODO: 추후 wins 값 들어오면 수정 */}
                    <More>
                      {champion.wins || "0"}승{" "}
                      {champion.wins ? champion.games - champion.wins : "0"}패
                    </More>
                    <Head>KDA</Head>
                    <Rate>1.98</Rate>
                    <More>0 / 0 / 0</More>
                    <Head>CS</Head>
                    <Rate>
                      {champion.csPerMinute !== undefined
                        ? champion.csPerMinute.toFixed(1)
                        : "-"}
                    </Rate>
                    <More>190.6</More>
                  </ChampionTable>
                </Tooltip>
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

const Title = styled.p<{ $font: string }>`
  ${(props) =>
    props.theme.fonts[`${props.$font}` as keyof typeof props.theme.fonts]};
  color: ${theme.colors.gray600};
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

const Tooltip = styled.div`
  position: absolute;
  bottom: -170px;
  left: 50%;
  transform: translateX(-50%);
  width: 223px;
  height: 154px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: ${theme.colors.white};
  border-radius: 14px;
  ${theme.fonts.regular14};
  box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(5.3px);
  z-index: 10;
  text-align: left;
  animation: ${fadeIn} 0.3s ease-in-out;

  &::before {
    content: "";
    position: absolute;
    top: -10.5px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.7) transparent;
  }

  ${ChampionWrapper}:not(:hover) & {
    animation: ${fadeOut} 0.3s ease-in-out;
  }
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
`;

const NoData = styled.div`
  height: 50px;
`;
