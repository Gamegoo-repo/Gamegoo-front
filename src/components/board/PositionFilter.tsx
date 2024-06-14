import styled from "styled-components";
import { theme } from "@/styles/theme";
import RandomSvg from "../svg/RandomPosition"
import BotSvg from "../svg/BotPosition";
import JungleSvg from "../svg/JunglePosition";
import MidSvg from "../svg/MidPosition";
import TopSvg from "../svg/TopPosition";
import SupporterSvg from "../svg/SupporterPosition";

interface SvgProps {
    onPositionFilter: (id: number) => void;
    isPosition: number;
}

const PositionFilter = (props: SvgProps) => {
    const { onPositionFilter, isPosition } = props;

    return (
        <Wrapper>
            <Button
                className={isPosition === 0 ? 'active' : 'default'}
                onClick={() => onPositionFilter(0)}>
                <RandomSvg
                    width='13'
                    height='11'
                    currentColor={isPosition === 0 ? 'white' : '#4B4B4B'} />
            </Button>
            <Button
                className={isPosition === 1 ? 'active' : 'default'}
                onClick={() => onPositionFilter(1)}>
                <TopSvg
                    width='17'
                    height='17'
                    currentColor1={isPosition === 1 ? 'white' : '#4B4B4B'}
                    currentColor2={isPosition === 1 ? 'white' : '#8B8B8B'} />
            </Button>
            <Button
                className={isPosition === 2 ? 'active' : 'default'}
                onClick={() => onPositionFilter(2)}>
                <JungleSvg
                    width='19'
                    height='19'
                    currentColor={isPosition === 2 ? 'white' : '#8B8B8B'} />
            </Button>
            <Button
                className={isPosition === 3 ? 'active' : 'default'}
                onClick={() => onPositionFilter(3)}>
                <MidSvg
                    width='17'
                    height='17'
                    currentColor1={isPosition === 3 ? 'white' : '#4B4B4B'}
                    currentColor2={isPosition === 3 ? 'white' : '#8B8B8B'} />
            </Button>
            <Button
                className={isPosition === 4 ? 'active' : 'default'}
                onClick={() => onPositionFilter(4)}>
                <BotSvg
                    width='17'
                    height='17'
                    currentColor1={isPosition === 4 ? 'white' : '#8B8B8B'}
                    currentColor2={isPosition === 4 ? 'white' : '#4B4B4B'} />
            </Button>
            <Button
                className={isPosition === 5 ? 'active' : 'default'}
                onClick={() => onPositionFilter(5)}>
                <SupporterSvg
                    width='22'
                    height='18'
                    currentColor={isPosition === 5 ? 'white' : '#8B8B8B'} />
            </Button>
        </Wrapper>
    )
};

export default PositionFilter;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const Button = styled.button`
    height: 56px;
    padding:0 15px;
    border-right: 1px solid #E4E4E4;

    &:first-child{
        border-radius: 10px 0 0 10px;
    }
    &:last-child{
        border-right:unset;
        border-radius: 0 10px 10px 0;
    }
    &.default {
        background:#F5F5F5;
    }
    &.active{
        background:${theme.colors.purple100};
        &:first-child{
            border-radius: 10px 0 0 10px;
        }
        &:last-child{
            border-radius: 0 10px 10px 0;
        }
    }
`;
