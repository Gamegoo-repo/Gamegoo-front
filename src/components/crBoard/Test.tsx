import styled from "styled-components";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PositionCategory from "../common/PositionCategory";

const Test = () => {
    const [selectedBox, setSelectedBox] = useState<string | null>(null);
    const [clickedButton, setClickedButton] = useState<string | null>(null);
    const [positionValue, setPositionValue] = useState<string>("");
    const positionRef = useRef<HTMLDivElement>(null);

    const handleBoxClick = (boxNumber: string) => {
        if (selectedBox === boxNumber) {
            setSelectedBox(null); 
        } else {
            setSelectedBox(boxNumber);
        }
        setClickedButton(null); 
    };

    const handleButtonClick = (boxNumber: string, buttonLabel: string) => {
        setClickedButton(`Box ${boxNumber}: ${buttonLabel}`);
        setPositionValue(buttonLabel)
        setSelectedBox(null); 
    };

    const handlePositionImgSet = (buttonLabel: string) => {
        switch (buttonLabel) {
            case 'random':
                return '/assets/icons/position_bot_purple.svg';
            case 'top':
                return '/assets/icons/position_supporter_purple.svg';
            case 'jungle':
                return '/assets/icons/position_bot_purple.svg';
            case 'mid':
                return '/assets/icons/position_bot_purple.svg';
            case 'bottom':
                return '/assets/icons/position_supporter_purple.svg';
            case 'supporter':
                return '/assets/icons/position_supporter_purple.svg';
            default:
                return '/assets/icons/position_supporter_purple.svg';
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (positionRef.current && !positionRef.current.contains(event.target as Node)) {
            setSelectedBox(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    console.log(clickedButton)
    return (
        <PositionWrapper>
            <FirstBox>
                <Section>
                    <Title>주 포지션</Title>
                    <Image
                        onClick={() => handleBoxClick('main')}
                        // src='/assets/icons/position_supporter_purple.svg'
                        src={handlePositionImgSet(positionValue)}
                        width={35}
                        height={28}
                        alt="main position image"
                    />
                </Section>
                <Section>
                    <Title>부 포지션</Title>
                    <Image
                        onClick={() => handleBoxClick('sub')}
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
                    onClick={() => handleBoxClick('want')}
                    src='/assets/icons/position_supporter_purple.svg'
                    width={35}
                    height={28}
                    alt="main position image"
                />
            </SecondBox>
            {selectedBox !== null && (
                <div ref={positionRef}>
                    <PositionCategory boxNumber={selectedBox} onButtonClick={handleButtonClick} />
                </div>
            )
            }
        </PositionWrapper >
    )
};

export default Test;

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