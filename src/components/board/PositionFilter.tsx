import { theme } from "@/styles/theme";
import styled from "styled-components";
import Random from "../../../public/assets/icons/default_random.svg";
import Top from "../../../public/assets/icons/default_top.svg";
import Jungle from "../../../public/assets/icons/default_jungle.svg";
import Mid from "../../../public/assets/icons/default_mid.svg";
import Bottom from "../../../public/assets/icons/default_bottom.svg";
import Supporter from "../../../public/assets/icons/default_supporter.svg";

interface SvgProps {
    onPositionFilter: (id: number) => void;
    isPosition: number;
}

const PositionFilter = (props: SvgProps) => {
    const { onPositionFilter, isPosition } = props;

    return (
        <Wrapper>
            <RandomButton
                onClick={() => onPositionFilter(0)}
                $isPosition={isPosition}>
                <Random />
            </RandomButton>
            <TopButton
                onClick={() => onPositionFilter(1)}
                $isSelected={isPosition === 1}>
                <Top />
            </TopButton>
            <JungleButton
                onClick={() => onPositionFilter(2)}>
                <Jungle />
            </JungleButton>
            <MidButton
                onClick={() => onPositionFilter(3)}>
                <Mid />
            </MidButton>
            <BottomButton
                onClick={() => onPositionFilter(4)}>
                <Bottom />
            </BottomButton>
            <SupporterButton
                onClick={() => onPositionFilter(5)}>
                <Supporter />
            </SupporterButton>
        </Wrapper>
    );
};

export default PositionFilter;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`;

const RandomButton = styled.button<{ $isPosition: number }>`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};
    border-radius: 10px 0 0 10px;
    
    stroke: ${({ $isPosition }) =>
        $isPosition === 0
            ? `${theme.colors.white}`
            : 'unset'
    };

    background: ${({ $isPosition }) =>
        $isPosition === 0
            ? `${theme.colors.purple100}`
            : 'unset'
    };

    &:hover {
        ${({ $isPosition }) =>
        $isPosition === 0
            ? `unset`
            : `background: ${theme.colors.gray300}`
    };
    }

    &:active,
    &:focus path {
        stroke: ${theme.colors.white};
    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
    }
`;

const TopButton = styled.button<{ $isSelected: boolean }>`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    background: ${({ $isSelected }) =>
        $isSelected ? `${theme.colors.purple100}` : "unset"};

    /* &:hover {
        background: ${theme.colors.gray300};
    } */

    &:active,
    &:focus path:first-child {
        fill: ${theme.colors.white}

    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
        background: ${({ $isSelected }) =>
        $isSelected ? `${theme.colors.purple100}` : "unset"};
    }
`;

const JungleButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    &:hover {
        background: ${theme.colors.gray300};
    }

    &:active,
    &:focus path {
        fill: ${theme.colors.white};
    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
    }
`;

const MidButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    &:hover {
        background: ${theme.colors.gray300};
    }

    &:active,
    &:focus path:nth-child(2) {
        fill: ${theme.colors.white};
    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
    }
`;

const BottomButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    &:hover {
        background: ${theme.colors.gray300};
    }

    &:active,
    &:focus path:nth-child(2) {
        fill: ${theme.colors.white};
    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
    }
`;

const SupporterButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-radius: 0 10px 10px 0;

    &:hover {
        background: ${theme.colors.gray300};
    }

    &:active,
    &:focus path {
        fill: ${theme.colors.white};
    }

    &:active,
    &:focus {
        background: ${theme.colors.purple100};
    }
`;

