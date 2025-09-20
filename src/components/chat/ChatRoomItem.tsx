import styled from "styled-components";

import Icon from "@/components/common/Icon";
import { useMediaQueryContext } from "@/hooks";
import { theme } from "@/styles/theme";
import { trackButtonClick } from "@/utils/analytics";
import { setChatRoomDateFormatter } from "@/utils/timeFormat";

import MoreBox from "../common/MoreBox";
import ProfileAvatar from "./ProfileAvatar";

import type { ChatroomList, MoreBoxMenuItems } from "@/types";

interface ChatRoomItemProps {
  room: ChatroomList;
  onChatRoom: (id: string) => void;
  isMoreBoxOpen: number | null;
  handleMoreBoxOpen: (
    chatId: number,
    uuid: string,
    room: ChatroomList,
    e: React.MouseEvent
  ) => void;
  moreMenuItems: (room: ChatroomList) => MoreBoxMenuItems[];
  setIsMoreBoxOpen: React.Dispatch<React.SetStateAction<number | null>>;
}

const ChatRoomItem = (props: ChatRoomItemProps) => {
  const {
    room,
    onChatRoom,
    isMoreBoxOpen,
    handleMoreBoxOpen,
    moreMenuItems,
    setIsMoreBoxOpen,
  } = props;

  const { isMobile } = useMediaQueryContext();

  const handleUnreadMsgCount = (unread: number) => {
    return unread > 99 ? "99+" : unread;
  };

  return (
    <UserContent onClick={() => {
      trackButtonClick("채팅방 입장", "chat", "sidebar", { roomId: room.chatroomId });
      onChatRoom(room.uuid);
    }} key={room.chatroomId}>
      {isMoreBoxOpen === room.chatroomId && (
        <MoreBox
          items={moreMenuItems(room)}
          top={10}
          right={30}
          onClose={() => setIsMoreBoxOpen(null)}
        />
      )}
      <Left>
        <ProfileAvatar
          profileImgNum={room.targetMemberImg}
          isBlind={room.blind}
        />
        <Middle>
          {!isMobile ? (
            <>
              <Row>
                <UserName>{room.targetMemberName}</UserName>
                {room.notReadMsgCnt !== 0 && (
                  <Unread>{handleUnreadMsgCount(room.notReadMsgCnt)}</Unread>
                )}
              </Row>
              <Row>
                <Msg>{room.lastMsg}</Msg>
                <Date>{setChatRoomDateFormatter(room.lastMsgAt)}</Date>
              </Row>
            </>
          ) : (
            <>
              <Row>
                <NameWrap>
                  <UserName>{room.targetMemberName}</UserName>
                  <Date>{setChatRoomDateFormatter(room.lastMsgAt)}</Date>
                </NameWrap>

                {room.notReadMsgCnt !== 0 && (
                  <Unread>{handleUnreadMsgCount(room.notReadMsgCnt)}</Unread>
                )}
              </Row>
              <Row>
                <Msg>{room.lastMsg}</Msg>
              </Row>
            </>
          )}
        </Middle>
      </Left>
      <ThreeDotsButton
        onClick={(e) => handleMoreBoxOpen(room.chatroomId, room.uuid, room, e)}
      >
        <Icon
          backgroundUrl="/assets/icons/three_dots_button_black.svg"
          width={3}
          height={15}
        />
      </ThreeDotsButton>
    </UserContent>
  );
};

export default ChatRoomItem;

const UserContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  padding: 18px 12px 18px 0;
  &:hover {
    background: ${theme.colors.gray100};
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 21px;
`;

const Middle = styled.div`
  min-width: 300px;
  margin-left: 14px;
  @media (max-width: ${theme.breakpoints.mobile}) {
    min-width: unset;
  }
`;

const NameWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const UserName = styled.p`
  ${(props) => props.theme.fonts.semiBold14};
  color: ${theme.colors.gray800};
`;

const Unread = styled.p`
  ${(props) => props.theme.fonts.medium11};
  color: ${theme.colors.white};
  padding: 0 5px;
  border-radius: 38px;
  background: ${theme.colors.violet600};
`;

const Row = styled.div`
  height: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Msg = styled.p`
  ${theme.fonts.regular14};
  color: ${theme.colors.gray800};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 215px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    width: initial;
  }
`;

const Date = styled.p`
  display: flex;
  align-items: center;
  ${theme.fonts.medium11};
  color: #c1c1c1;
  margin-right: 12px;
`;

const ThreeDotsButton = styled.button`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
