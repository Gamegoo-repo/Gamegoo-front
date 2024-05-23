import { theme } from "@/styles/theme";
import styled from "styled-components";
import Random from "../../../public/assets/icons/position_random_unclicked.svg"
import Top from "../../../public/assets/icons/position_top_unclicked.svg"
import Jungle from "../../../public/assets/icons/position_jungle_unclicked.svg"
import Mid from "../../../public/assets/icons/position_mid_unclicked.svg"
import Bottom from "../../../public/assets/icons/position_bottom_unclicked.svg"
import Supporter from "../../../public/assets/icons/position_supporter_unclicked.svg"


interface PositionCategoryProps {
    onClose: () => void;
}
const PositionCategory = (props: PositionCategoryProps) => {

    return (
        <Overlay onClick={props.onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
                <Box>
                    <RandomButton>
                        <Random />
                    </RandomButton>
                    <TopButton>
                        <Top />
                    </TopButton>
                    <JungleButton>
                        <Jungle />
                    </JungleButton>
                    <MidButton>
                        <Mid />
                    </MidButton>
                    <BottomButton>
                        <Bottom />
                    </BottomButton>
                    <SupporterButton>
                        <Supporter />
                    </SupporterButton>
                </Box>
            </Wrapper>
        </Overlay>
    )
}

export default PositionCategory;

const Overlay = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    position:fixed;
    inset: 0;
`

const Wrapper = styled.div`
    position: absolute;
    z-index: 1;
`

const Box = styled.div`
    display: flex;
    align-items: center;
    column-gap: 50px;
    position:relative; 
    margin: 50px;
    width:482px; 
    padding:29px;
    background:${theme.colors.black};
    border-radius: 16.3px;
        &:after { 
    border-top: 0px solid transparent;
    border-left: 9px solid transparent;
    border-right: 9px solid transparent;
    border-bottom: 18px solid ${theme.colors.black};
    content: "";
    position: absolute;
    top: -13px;
    left: 7%; 
}
`

const RandomButton = styled.button`
     &:hover path{
        stroke:#9F90F9;
    }
    &:active,
    &:focus path{
        stroke:${theme.colors.purple100};
    }
`

const TopButton = styled.button`
    &:hover path:first-child{
        fill:#9F90F9;
    }
    &:active,
    &:focus path:first-child{
        fill:${theme.colors.purple100};
    }
`

const JungleButton = styled.button`
    &:hover path{
        fill:#9F90F9;
    }
    &:active,
    &:focus path{
        fill:${theme.colors.purple100};
    }
`

const MidButton = styled.button`
    &:hover path:nth-child(2){
        fill:#9F90F9;
    }
    &:active,
    &:focus path:nth-child(2){
        fill:${theme.colors.purple100};
    }
`

const BottomButton = styled.button`
    &:hover path:nth-child(2){
        fill:#9F90F9;
    }
    &:active,
    &:focus path:nth-child(2){
        fill:${theme.colors.purple100};
    }
`

const SupporterButton = styled.button`
    &:hover path{
        fill:#9F90F9;
    }
    &:active,
    &:focus path{
        fill:${theme.colors.purple100};
    }
`