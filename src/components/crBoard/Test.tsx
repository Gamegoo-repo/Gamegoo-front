import styled from "styled-components";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PositionCategory from "../common/PositionCategory";

interface TestProps {
    onPositionChange: (newPositionValue: PositionState) => void;
}

export interface PositionState {
    main: string;
    sub: string;
    want: string;
}

const Test = ({ onPositionChange }: TestProps) => {
    const [selectedBox, setSelectedBox] = useState<string | null>(null);
    const [positionValue, setPositionValue] = useState<PositionState>({
        main: '',
        sub: '',
        want: ''
    });

    const handleButtonClick = (boxNumber: string, buttonLabel: string) => {
        const newPositionValue = { ...positionValue, [boxNumber]: buttonLabel };
        setPositionValue(newPositionValue);
        onPositionChange(newPositionValue);
        setSelectedBox(null);
    };
    const positionRef = useRef<HTMLDivElement>(null);

    const handleBoxClick = (boxNumber: string) => {
        setSelectedBox(prevSelectedBox => (prevSelectedBox === boxNumber ? null : boxNumber));
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

    return (
        <PositionWrapper>
            <FirstBox>
                <Section>
                    <Title>주 포지션</Title>
                    <Image
                        onClick={() => handleBoxClick('main')}
                        src={handlePositionImgSet(positionValue.main)}
                        width={35}
                        height={28}
                        alt="main position image"
                    />
                </Section>
                <Section>
                    <Title>부 포지션</Title>
                    <Image
                        onClick={() => handleBoxClick('sub')}
                        src={handlePositionImgSet(positionValue.sub)}
                        width={35}
                        height={28}
                        alt="sub position image"
                    />
                </Section>
            </FirstBox>
            <SecondBox>
                <Title>찾는 포지션</Title>
                <Image
                    onClick={() => handleBoxClick('want')}
                    src={handlePositionImgSet(positionValue.want)}
                    width={35}
                    height={28}
                    alt="want position image"
                />
            </SecondBox>
            {selectedBox !== null && (
                <div ref={positionRef}>
                    <PositionCategory boxNumber={selectedBox} onButtonClick={handleButtonClick} />
                </div>
            )}
        </PositionWrapper>
    );
};

export default Test;

const PositionWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 13px;
`;

const FirstBox = styled.div`
    display: flex;
    align-items: center;
    text-align: center;
    background: #f6f6f6;
    border-radius: 10px;
    padding: 22px 36px;
    gap: 52px;
`;

const Section = styled.div``;

const SecondBox = styled.div`
    text-align: center;
    background: #f6f6f6;
    border-radius: 10px;
    padding: 22px 44px;
`;

const Title = styled.p`
    margin-bottom: 5px;
`;
