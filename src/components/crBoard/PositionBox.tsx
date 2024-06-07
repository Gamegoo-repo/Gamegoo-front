import styled from "styled-components";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import PositionCategory from "../common/PositionCategory";

interface PositionBoxProps {
    // onClose: () => void;
 
    handlePositionValue:(value:string)=>void;
};

const PositionBox = (props: PositionBoxProps) => {
    const { handlePositionValue} = props;

    const boxRefs = useRef<HTMLDivElement>(null);

    // const handlePositionClickOutside = (event: MouseEvent) => {
    //     if (boxRefs.current && !boxRefs.current.contains(event.target as Node)) {
    //         setIsSelectPositionOpen({
    //             ...isSelectPositionOpen,
    //             [isPositionType]: false
    //         })
    //     }
    // };

    // useEffect(() => {
    //     document.addEventListener('mousedown', handlePositionClickOutside);
    //     console.log(1)
    //     return () => {
    //         document.removeEventListener('mousedown', handlePositionClickOutside);
    //         console.log(2)
    //     };
    // });

    const [isPositionType, setIsPositionType] = useState("")
    const [isSelectPositionOpen, setIsSelectPositionOpen] = useState({
        main: false,
        sub: false,
        want: false
    });

    const togglePosition = (position: 'main' | 'sub' | 'want') => {
        setIsPositionType(position);
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
                    {isSelectPositionOpen.main &&
                        <PositionCategory
                            type="main"
                            ref={boxRefs}
                            // onClose={onClose}
                            onSetPosition={handlePositionValue} />}
                    {/* {openBox === 'main' && (<PositionCategory ref={(el) => {
                        boxRefs.current['main'] = el;
                    }}
                        onClose={onClose}
                        onSetPosition={onSetPosition} />)} */}
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
                    {isSelectPositionOpen.sub &&
                        <PositionCategory
                            type="sub"
                            ref={boxRefs}
                            // onClose={onClose}
                            onSetPosition={handlePositionValue} />}
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
                {isSelectPositionOpen.want &&
                    <PositionCategory
                        type="want"
                        ref={boxRefs}
                        // onClose={onClose}
                        onSetPosition={handlePositionValue} />}
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