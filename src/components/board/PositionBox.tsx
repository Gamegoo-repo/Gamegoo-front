import styled from "styled-components";
import Image from "next/image";
import PositionFilter from "../common/PositionFilter";
import { useState } from "react";

const PositionBox = () => {
    const [isSelectPositionOpen, setIsSelectPositionOpen] = useState({
        main: false,
        sub: false,
        want: false
    });

    const togglePosition = (position: 'main' | 'sub' | 'want') => {
        setIsSelectPositionOpen(prevState => ({
            ...prevState,
            [position]: !prevState[position]
        }));
    };

    return (
        <PositionWrapper>
            <FirstBox>
                <Section>
                    <Title>주 포지션</Title>
                    <Image
                        onClick={() => togglePosition('main')}
                        src='/assets/icons/position_supporter_purple.svg'
                        width={35}
                        height={28}
                        alt="main position image"
                    />
                    {isSelectPositionOpen.main && <PositionFilter />}
                </Section>
                <Section>
                    <Title>부 포지션</Title>
                    <Image
                        onClick={() => togglePosition('sub')}
                        src='/assets/icons/position_bot_purple.svg'
                        width={35}
                        height={28}
                        alt="main position image"
                    />
                </Section>
            </FirstBox>
            <SecondBox>
                <Title>찾는 포지션</Title>
                <Image
                    onClick={() => togglePosition('want')}
                    src='/assets/icons/position_supporter_purple.svg'
                    width={35}
                    height={28}
                    alt="main position image"
                />
            </SecondBox>
        </PositionWrapper>
    )
};

export default PositionBox;

const PositionWrapper = styled.div`
    display: flex;
    align-items: center;
    gap:13px;
`

const FirstBox = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    background: #F6F6F6;
    border-radius: 10px;
    padding: 22px 36px;
    gap:52px;
`

const Section = styled.div``

const SecondBox = styled.div`
    text-align: center;
    background: #F6F6F6;
    border-radius: 10px;
    padding: 22px 44px;
`

const Title = styled.p`
    margin-bottom: 5px;
`