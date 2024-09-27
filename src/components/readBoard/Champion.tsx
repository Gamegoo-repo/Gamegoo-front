import styled from "styled-components";
import Image from "next/image";

interface ChampionProps {
  list: number[];
  size?: number;
}

const Champion = (props: ChampionProps) => {
  const { list, size = 18 } = props;
  return (
    <Wrapper>
      <Title $size={size}>최근 선호 챔피언</Title>
      {list?.length !== 0 ? (
        <Images>
          {/* {list?.map((champion,key) => (
          <Image
            key={key}
            src={champion.value}
            width={50}
            height={50}
            alt="champion image"
          />
        ))} */}
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

const NoData = styled.div`
  height: 50px;
`;
