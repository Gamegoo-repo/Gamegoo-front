import styled from "styled-components";
import Image from "next/image";

interface ChampionProps {
  list: number[];
  size?: number;
}

const Champion = (props: ChampionProps) => {
  const { list } = props;

  // 챔피언 이미지를 로드 실패 시 기본 이미지로
  const handleImageError = (e: any) => {
    e.target.src = "/assets/images/champion/no_champion.svg";
  };

  return (
    <Wrapper>
      {list?.length !== 0 ? (
        <Images>
          {list?.map((champion, key) => (
            <ImageWrapper key={key}>
              <Image
                src={`/assets/images/champion/${champion}.png`}
                width={52}
                height={52}
                alt={`champion-${champion}`}
                style={{
                  transform: "scale(1.2)", // 120% 확대
                  objectFit: "cover",
                }}
                onError={handleImageError}
              />
            </ImageWrapper>
          ))}
        </Images>
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
  gap: 7px;
`;

const Title = styled.p<{ $size: number }>`
  ${(props) =>
    props.theme.fonts[
      `semiBold${props.$size}` as keyof typeof props.theme.fonts
    ]};
  color: #222222;
`;

const Images = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;

const ImageWrapper = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
`;

const NoData = styled.div`
  height: 50px;
`;
