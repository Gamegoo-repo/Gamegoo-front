import styled from "styled-components";
import Image from "next/image";
import { useState } from "react";
import PositionCategory from "../common/PositionCategory";

interface PositionBoxProps {
    status: "posting" | "reading";
    onPositionChange?: ((newPositionValue: PositionState) => void);
}

export interface PositionState {
    main: string;
    sub: string;
    want: string;
}

const PositionBox = (props: PositionBoxProps) => {
    const { status, onPositionChange } = props;
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
        if (onPositionChange) {
            onPositionChange(newPositionValue);
        }
    };


    const handleBoxClick = (boxName: string) => {
        if (status === "reading") return;
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
        <PositionWrapper $status={status}>
            <FirstBox $status={status}>
                <Section>
                    <Title>주 포지션</Title>
                    <StyledImage
                        $status={status}
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
                        $status={status}
                        onClick={() => handleBoxClick('sub')}
                        src={handlePositionImgSet(positionValue.sub)}
                        width={35}
                        height={28}
                        alt="sub position image"
                    />
                </Section>
            </FirstBox>
            <SecondBox $status={status}>
                <Title>찾는 포지션</Title>
                <StyledImage
                    $status={status}
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

const PositionWrapper = styled.div<{ $status: string }>`
    display: flex;
    align-items: center;
    gap: ${({ $status }) =>
        $status === 'posting'
            ? '13px'
            : '15px'
    };
`;

const FirstBox = styled.div<{ $status: string }>`
    display: flex;
    align-items: center;
    text-align: center;
    white-space: nowrap;
    background: #f6f6f6;
    border-radius: 10px;
    padding: ${({ $status }) =>
        $status === 'posting'
            ? '22px 36px'
            : '22px 52px'
    };
    gap: ${({ $status }) =>
        $status === 'posting'
            ? '52px'
            : '90px'
    };
`;

const Section = styled.div``;

const SecondBox = styled.div<{ $status: string }>`
    text-align: center;
    background: #f6f6f6;
    white-space: nowrap;
    border-radius: 10px;
    padding:  ${({ $status }) =>
        $status === 'posting'
            ? '22px 44px'
            : '22px 113px'
    };
`;

const Title = styled.p`
    margin-bottom: 5px;
`;

const StyledImage = styled(Image) <{ $status: string }>`
    cursor : ${({ $status }) =>
        $status === 'posting'
            ? 'pointer'
            : 'unset'
    };
`;
