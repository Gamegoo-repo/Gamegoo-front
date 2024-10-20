import { theme } from "@/styles/theme";
import styled from "styled-components";
import All from "../../../public/assets/icons/default_all.svg";
import Top from "../../../public/assets/icons/default_top.svg";
import Jungle from "../../../public/assets/icons/default_jungle.svg";
import Mid from "../../../public/assets/icons/default_mid.svg";
import OneDeal from "../../../public/assets/icons/default_one_deal.svg";
import Supporter from "../../../public/assets/icons/default_supporter.svg";

interface SvgProps {
    onPositionFilter: (id: number) => void;
    isPosition: number;
}

const PositionFilter = (props: SvgProps) => {
    const { onPositionFilter, isPosition } = props;

    return (
        <Wrapper>
            <AllButton
                onClick={() => onPositionFilter(0)}
                className={isPosition === 0 ? 'clicked' : ''}>
                <All />
            </AllButton>
            <TopButton
                onClick={() => onPositionFilter(1)}
                className={isPosition === 1 ? 'clicked' : ''} >
                <Top />
            </TopButton>
            <JungleButton
                onClick={() => onPositionFilter(2)}
                className={isPosition === 2 ? 'clicked' : ''}>
                <Jungle />
            </JungleButton>
            <MidButton
                onClick={() => onPositionFilter(3)}
                className={isPosition === 3 ? 'clicked' : ''}>
                <Mid />
            </MidButton>
            <OneDealButton
                onClick={() => onPositionFilter(4)}
                className={isPosition === 4 ? 'clicked' : ''}>
                <OneDeal />
            </OneDealButton>
            <SupporterButton
                onClick={() => onPositionFilter(5)}
                className={isPosition === 5 ? 'clicked' : ''}>
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

const AllButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};
    border-radius: 10px 0 0 10px;

    &:hover {
        background: ${theme.colors.gray300};
    }

    &.clicked {
        background: ${theme.colors.purple100};

        path {
        stroke: ${theme.colors.white}
        }
    }
`;

const TopButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    &:hover {
        background: ${theme.colors.gray300};
    }

    &.clicked {
        background: ${theme.colors.purple100};

        path:first-child {
        fill: ${theme.colors.white}
        }
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

    &.clicked {
        background: ${theme.colors.purple100};

        path {
        fill: ${theme.colors.white};
        }
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

    &.clicked {
        background: ${theme.colors.purple100};

        path:nth-child(2) {
        fill: ${theme.colors.white};
     }
    }
`;

const OneDealButton = styled.button`
    max-width: 48px;
    height: 56px;
    padding:0 15px;
    border-right: 1px solid ${theme.colors.gray400};

    &:hover {
        background: ${theme.colors.gray300};
    }

    &.clicked {
        background: ${theme.colors.purple100};

        path:nth-child(2) {
        fill: ${theme.colors.white};
     }
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

    &.clicked {
        background: ${theme.colors.purple100};

        path {
        fill: ${theme.colors.white};
     }
    }
`;

