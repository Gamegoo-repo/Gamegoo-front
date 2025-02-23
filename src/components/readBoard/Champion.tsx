import styled from "styled-components";
import Image from "next/image";
import { theme } from "@/styles/theme";

interface ChampionProps {
  title?: boolean;
  list?: number[];
  font?: string;
}

const Champion = (props: ChampionProps) => {
  const { list, font = "semiBold18", title = false } = props;

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
            <ChampionWrapper key={key}>
              <ImageWrapper>
                <Image
                  src={`/assets/images/champion/${champion}.png`}
                  width={48}
                  height={48}
                  alt={`champion-${champion}`}
                  style={{
                    transform: "scale(1.2)", // 120% 확대
                    objectFit: "cover",
                  }}
                  onError={handleImageError}
                />
                <Percentage>52%</Percentage>
              </ImageWrapper>
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
  color: ${theme.colors.gray800};
`;

const Champions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChampionWrapper = styled.div`
  height: 62px;
  position: relative;
`;

const ImageWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
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
`;

const NoData = styled.div`
  height: 50px;
`;
