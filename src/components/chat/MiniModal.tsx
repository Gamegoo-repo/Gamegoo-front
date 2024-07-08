import styled from "styled-components";
import { theme } from "@/styles/theme";
import { useState } from "react";

const MiniModal = () => {
    const [isNextModal, setNextModal] = useState("");
    return (
        <Wrapper>
            <Ul>
                <Li onClick={() => setNextModal("leave")}>채팅방 나가기</Li>
                <Li>친구 추가</Li>
                <Li onClick={() => setNextModal("block")}>차단하기</Li>
                <Li onClick={() => setNextModal("report")}>신고하기</Li>
                <Li onClick={() => setNextModal("manner")}>매너 평가</Li>
                <Li onClick={() => setNextModal("badManner")}>비매너 평가</Li>
            </Ul>
        </Wrapper>
    )
};

export default MiniModal;

const Wrapper = styled.div`
  position: absolute;
  top: 35px;
  right: 10%;
  background: ${theme.colors.white};
  box-shadow: 0 0 21.3px 0 #00000026;
  border-radius: 10px;
  padding: 1px 0;
  z-index: 10;
  max-width: 175px;
  width: 100%;
`;

const Ul = styled.ul`

`;
const Li = styled.li`
  border-bottom: 1px solid #DDDDDDDD;
  padding:10px 20px;
  text-align: center;
  ${(props) => props.theme.fonts.medium15};
  color: #555555;
  cursor: pointer;
`;