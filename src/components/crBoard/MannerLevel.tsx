import styled from "styled-components";
import { theme } from "@/styles/theme";

interface MannerLevelProps {
    level: number;
}

const MannerLevel = (props: MannerLevelProps) => {
    const { level } = props;

    return (
        <Wrapper>
            <Level>
                LV.{level}
            </Level>
        </Wrapper>
    )
};

export default MannerLevel;

const Wrapper = styled.div`
    height: fit-content;
    background: #000000A6;
    padding:5px 11px;
    box-shadow: 0 4px 4px 0 #00000040;
    border-radius: 57px;
    margin-left: 10px;
    cursor: pointer;
`;

const Level = styled.p`
    ${(props) => props.theme.fonts.bold14};
    color:${theme.colors.purple300};
`;