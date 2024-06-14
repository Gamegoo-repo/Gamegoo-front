import styled from "styled-components";
import { theme } from "@/styles/theme";

interface MannerLevelProps {
    level: number;
    onClick: (e: React.MouseEvent) => void;
}

const MannerLevel = (props: MannerLevelProps) => {
    const { level, onClick } = props;

    return (
        <>
            <LevelWrapper onClick={onClick}>
                <Level>
                    <Text>
                        LV.{level}
                    </Text>
                </Level>
            </LevelWrapper>
            <BubbleWrapper>
                <Bubble>
                    <P>
                        클릭해서 매너키워드 보기
                    </P>
                </Bubble>
            </BubbleWrapper>
        </>
    )
};

export default MannerLevel;

const LevelWrapper = styled.div`
    position: relative;
`;

const BubbleWrapper = styled.div`
    position: absolute;
    top: 22px;
    left: 39.5%;
`;

const Bubble = styled.div`
    border: 1px solid ${theme.colors.purple200};
    padding: 7px 13px; 
    background: ${theme.colors.purple500};
    border-radius: 46px;
        &:after {
        content: '';
        display: block;
        position: absolute;
        bottom: -6px;
        right: 32px;
        width: 12px;
        height: 12px;
        background: #F2F0FC;
        border-left: 1px solid #9F90F9;
        border-bottom: 1px solid #9F90F9;
        transform: rotate(-45deg);
    }
`;

const P = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:#000;`;

const Level = styled.div`
    height: fit-content;
    background: #000000A6;
    padding:5px 11px;
    box-shadow: 0 4px 4px 0 #00000040;
    border-radius: 57px;
    margin-left: 10px;
    cursor: pointer;
`;

const Text = styled.p`
    ${(props) => props.theme.fonts.bold14};
    color:${theme.colors.purple300};
`;