import styled from "styled-components";
import { theme } from "@/styles/theme";

interface MiniModalProps {
  onChangeModal: (type: string) => void;
}

const MiniModal = (props: MiniModalProps) => {
  const { onChangeModal } = props;

  const handleAddFriend = () => {
    console.log('친구 추가')
  };

  return (
    <Wrapper>
      <Ul>
        <Li onClick={() => onChangeModal("leave")}>채팅방 나가기</Li>
        <Li onClick={handleAddFriend}>친구 추가</Li>
        <Li onClick={() => onChangeModal("block")}>차단하기</Li>
        <Li onClick={() => onChangeModal("report")}>신고하기</Li>
        <Li onClick={() => onChangeModal("manner")}>매너 평가</Li>
        <Li onClick={() => onChangeModal("badManner")}>비매너 평가</Li>
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
  &:last-child {
    border-bottom: none;
  }
`;
