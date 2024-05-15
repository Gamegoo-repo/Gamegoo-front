import { theme } from "@/styles/theme";
import Image from "next/image";
import styled from "styled-components";

const POSITION_ICONS = [
    { id: 1, name: '랜덤', path: '/assets/icons/position1.svg' },
    { id: 2, name: '원딜', path: '/assets/icons/position2.svg' },
    { id: 3, name: '정글', path: '/assets/icons/position3.svg' },
    { id: 4, name: '미들', path: '/assets/icons/position4.svg' },
    { id: 5, name: '탑', path: '/assets/icons/position5.svg' },
    { id: 6, name: '서폿', path: '/assets/icons/position6.svg' }
]
const PositionCategory = () => {
    return (
        <Overlay>
            <Wrapper>
                <Box>
                    {POSITION_ICONS.map(icon => {
                        return (
                            <Image
                                key={icon.id}
                                src={icon.path}
                                width={19}
                                height={16}
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