import { theme } from "@/styles/theme";
import Image from "next/image";
import { useState } from "react";
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
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(prevState => !prevState);
    };

    return (
        <Overlay onClick={props.onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
                <Box>
                    <StyledRandom  isClicked={isClicked}
      onClick={handleClick} />
                    <StyledTop />
                    <StyledJungle />
                    <StyledMid />
                    <StyledBottom />
                    <StyledSupporter />
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

const StyledRandom = styled(Random)`
    &:hover path{
        stroke:#9F90F9;
    }

`

const StyledTop = styled(Top)`
    &:hover path:first-child{
        fill:#9F90F9;
    }
`

const StyledJungle = styled(Jungle)`
    &:hover path{
        fill:#9F90F9;
    }`

const StyledMid = styled(Mid)`
    &:hover path:nth-child(2){
        fill:#9F90F9;
    }`

const StyledBottom = styled(Bottom)`
    &:hover path:nth-child(2){
        fill:#9F90F9;
    }`

const StyledSupporter = styled(Supporter)`
    &:hover path{
        fill:#9F90F9;
    }`