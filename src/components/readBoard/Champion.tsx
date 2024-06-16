import styled from "styled-components";
import Image from "next/image";

interface ChampioinListInterface {
    id: number;
    value: string;
}

interface ChampionProps {
    list: ChampioinListInterface[];
}

const Champion = (props: ChampionProps) => {
    const { list } = props;
    return (
        <Wrapper>
            <Title>최근 선호 챔피언</Title>
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
            </Images >
        </Wrapper>
    )
};

export default Champion;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Title = styled.p`
    ${(props) => props.theme.fonts.semiBold18};
    color: #222222;
    margin-bottom:4px;
`;

const Images = styled.div`
    display: flex;
    align-items: center;
    gap:9px;
`;

