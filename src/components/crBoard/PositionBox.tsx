import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import PositionCategory from "../common/PositionCategory";

interface PositionBoxProps {
    onPositionChange: (newPositionValue: PositionState) => void;
}

export interface PositionState {
    main: string;
    sub: string;
    want: string;
}

const PositionBox = ({ onPositionChange }: PositionBoxProps) => {
    const [selectedBox, setSelectedBox] = useState("");
    // TODO: api 연결 후 기존 data 가져오기
    const [positionValue, setPositionValue] = useState<PositionState>({
        main: '',
        sub: '',
        want: ''
    });
    const [isPositionOpen, setIsPositionOpen] = useState(false);

    const handleCategoryButtonClick = (boxName: string, buttonLabel: string) => {
        const newPositionValue = { ...positionValue, [boxName]: buttonLabel };
        setPositionValue(newPositionValue);
        onPositionChange(newPositionValue);
    };


    const handleBoxClick = (boxName: string) => {
        setSelectedBox(boxName)
        togglePosition();
    };

    const handlePositionImgSet = (buttonLabel: string) => {
        switch (buttonLabel) {
            case 'random':
                return '/assets/icons/position_random_purple.svg';
            case 'top':
                return '/assets/icons/position_top_purple.svg';
            case 'jungle':
                return '/assets/icons/position_jungle_purple.svg';
            case 'mid':
                return '/assets/icons/position_mid_purple.svg';
            case 'bottom':
                return '/assets/icons/position_bottom_purple.svg';
            case 'supporter':
                return '/assets/icons/position_supporter_purple.svg';
            default:
                return '/assets/icons/position_random_purple.svg';
        }
    };

    const togglePosition = () => {
        setIsPositionOpen(prev => !prev);
    };

    const closePosition = () => {
        setIsPositionOpen(false);
    };


    return (
        <PositionWrapper>
            <FirstBox>
                <Section>
                    <Title>주 포지션</Title>
                    <StyledImage
                        onClick={() => handleBoxClick('main')}
                        src={handlePositionImgSet(positionValue.main)}
                        width={35}
                        height={28}
                        alt="main position image"
                    />
                </Section>
                <Section>
                    <Title>부 포지션</Title>
                    <StyledImage
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
                <StyledImage
                    onClick={() => handleBoxClick('want')}
                    src={handlePositionImgSet(positionValue.want)}
                    width={35}
                    height={28}
                    alt="want position image"
                />
            </SecondBox>
            {isPositionOpen && <PositionCategory onClose={closePosition} boxName={selectedBox} onButtonClick={handleCategoryButtonClick} />}
        </PositionWrapper>
    );
};

export default PositionBox;

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

const StyledImage = styled(Image)`
    cursor: pointer;  
`;
