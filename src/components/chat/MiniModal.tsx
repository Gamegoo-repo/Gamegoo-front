import styled from "styled-components";
import { theme } from "@/styles/theme";
import { Dispatch } from "react";

interface MiniModalProps {
  onChangeModal: (type: string) => void;
  type?: "chatList";
  setIsMoreBoxOpen?: Dispatch<React.SetStateAction<number | null>>;
}

const MiniModal = ({
  onChangeModal, type, setIsMoreBoxOpen
}: MiniModalProps
) => {

  const handleAddFriend = (e: React.MouseEvent) => {
    if (type) {
      e.stopPropagation();
    }

    if (setIsMoreBoxOpen) {
      setIsMoreBoxOpen(null);
    }
    console.log('친구 추가')
  };

  const handleChangeModal = (e: React.MouseEvent, type: string) => {
    if (type) {
      e.stopPropagation();
    }

    onChangeModal(type);
  };

  return (
    <Wrapper $type={type}>
      <Ul>
        <Li onClick={(e) => handleChangeModal(e, "leave")}>채팅방 나가기</Li>
        <Li onClick={(e) => handleAddFriend(e)}>친구 추가</Li>
        <Li onClick={(e) => handleChangeModal(e, "block")}>차단하기</Li>
        <Li onClick={(e) => handleChangeModal(e, "report")}>신고하기</Li>
        <Li onClick={(e) => handleChangeModal(e, "manner")}>매너 평가</Li>
        <Li onClick={(e) => handleChangeModal(e, "badManner")}>비매너 평가</Li>
      </Ul>
    </Wrapper>
  )
};

export default MiniModal;

const Wrapper = styled.div<{ $type?: string }>`
  position: absolute;
  top: ${(props) =>
    props.$type ? "none" : "35px"};
  right: ${(props) =>
    props.$type ? "9%" : "10%"};
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
