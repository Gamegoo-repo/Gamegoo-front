import { theme } from "@/styles/theme";
import styled from "styled-components";
import Random from "../../../public/assets/icons/position_random_unclicked.svg";
import Top from "../../../public/assets/icons/position_top_unclicked.svg";
import Jungle from "../../../public/assets/icons/position_jungle_unclicked.svg";
import Mid from "../../../public/assets/icons/position_mid_unclicked.svg";
import Bottom from "../../../public/assets/icons/position_bottom_unclicked.svg";
import Supporter from "../../../public/assets/icons/position_supporter_unclicked.svg";
import { useRef } from "react";



const Filter = () => {

    // 포지션 컴포넌트 외부 클릭 시 
    // useEffect(() => {
    //   const handleClickOutside = (event: MouseEvent) => {
    //     if (ref.current && !ref.current.contains(event.target as Node)) {
    //       onClose();
    //     }
    //   };

    //   document.addEventListener('mousedown', handleClickOutside);
    //   return () => {
    //     document.removeEventListener('mousedown', handleClickOutside);
    //   };
    // }, [ref, onClose]);

    return (
        <Wrapper>
            {/* <Box>
        <RandomButton >
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
      </Box> */}
            <Button>
                <Random />
            </Button>
            <Button>
                <Top />
            </Button>
            <Button>
                <Jungle />
            </Button>
            <Button>
                <Mid />
            </Button>
            <Button>
                <Bottom />
            </Button>
            <Button>
                <Supporter />
            </Button>
        </Wrapper>
    );
};

export default Filter;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 238px;
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  column-gap: 50px;
  width: 482px; 
  padding: 18px 27px;
  background: ${theme.colors.black};
  border-radius: 16.3px;
`;

const RandomButton = styled.button`
  &:hover path {
    stroke: #9F90F9;
  }
  &:active,
  &:focus path {
    stroke: ${theme.colors.purple100};
  }
`;

const TopButton = styled.button`
  &:hover path:first-child {
    fill: #9F90F9;
  }
  &:active,
  &:focus path:first-child {
    fill: ${theme.colors.purple100};
  }
`;

const JungleButton = styled.button`
  &:hover path {
    fill: #9F90F9;
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.purple100};
  }
`;

const MidButton = styled.button`
  &:hover path:nth-child(2) {
    fill: #9F90F9;
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.purple100};
  }
`;

const BottomButton = styled.button`
  &:hover path:nth-child(2) {
    fill: #9F90F9;
  }
  &:active,
  &:focus path:nth-child(2) {
    fill: ${theme.colors.purple100};
  }
`;

const SupporterButton = styled.button`
  &:hover path {
    fill: #9F90F9;
  }
  &:active,
  &:focus path {
    fill: ${theme.colors.purple100};
  }
`;

const Button = styled.button`
    max-width: 48px;
    text-align: center;
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

