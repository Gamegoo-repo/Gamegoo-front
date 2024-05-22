import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

const POSITION_ICONS = [
    { id: 1, name: '랜덤', path: '/assets/icons/position_random_unclicked.svg', width: 19, height: 16 },
    { id: 2, name: '원딜', path: '/assets/icons/position_bottom_unclicked.svg', width: 26, height: 25 },
    { id: 3, name: '정글', path: '/assets/icons/position_jungle_unclicked.svg', width: 29, height: 28 },
    { id: 4, name: '미들', path: '/assets/icons/position_mid_unclicked.svg', width: 26, height: 25 },
    { id: 5, name: '탑', path: '/assets/icons/position_top_unclicked.svg', width: 26, height: 25 },
    { id: 6, name: '서폿', path: '/assets/icons/position_supporter_unclicked.svg', width: 34, height: 28 }
]

interface PositionCategoryProps {
    onClose: () => void;
}
const PositionCategory = (props: PositionCategoryProps) => {

    return (
        <Overlay onClick={props.onClose}>
            <Wrapper onClick={(e) => e.stopPropagation()}>
                <Box>
                    {POSITION_ICONS.map(icon => {
                        return (
                            <StyledImage
                                onClick={props.onClose}
                                key={icon.id}
                                src={icon.path}
                                width={icon.width}
                                height={icon.height}
                                alt={icon.name} />
                        )
                    })}

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

const StyledImage = styled(Image)`
   cursor: pointer;
   &:hover{
    /* filter: invert(59%) sepia(13%) saturate(1769%) hue-rotate(208deg) brightness(101%) contrast(95%); */
    path1 {
        fill:#9F90F9;
    }
   }
   &:active,
   &:focus{
    filter: invert(18%) sepia(64%) saturate(1326%) hue-rotate(223deg) brightness(97%) contrast(89%);
   }
`