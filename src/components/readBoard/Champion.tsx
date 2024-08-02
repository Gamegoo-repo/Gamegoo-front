import styled from "styled-components";
import Image from "next/image";

interface ChampioinListInterface {
  id: number;
  value: string;
}

interface ChampionProps {
  list: ChampioinListInterface[];
  size?: number;
}

const Champion = (props: ChampionProps) => {
  const { list, size = 18 } = props;
  return (
    <Wrapper>
      <Title size={size}>최근 선호 챔피언</Title>
      <Images>
        {list.map((champion) => (
          <Image
            key={champion.id}
            src={champion.value}
            width={50}
            height={50}
            alt="champion image"
          />
        ))}
      </Images>
    </Wrapper>
  );
};

export default Champion;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.p<{ size: number }>`
  ${(props) =>
    props.theme.fonts[
      `semiBold${props.size}` as keyof typeof props.theme.fonts
    ]};
  color: #222222;
`;

const Images = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
`;
