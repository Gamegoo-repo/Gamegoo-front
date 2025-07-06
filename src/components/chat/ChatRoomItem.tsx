import styled from "styled-components";
import { theme } from "@/styles/theme";
import Image from "next/image";
import { getProfileBgColor } from "@/utils/profile";
import { ChatroomList } from "@/types/api/chat/chat";
import MoreBox from "../common/MoreBox";
import { setChatRoomDateFormatter } from "@/utils/timeFormat";
import { MoreBoxMenuItems } from "@/interface/moreBox";
import useMediaQueries from "@/hooks/useMediaQueries";

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

  const isMobile = useMediaQueries({ breakpoint: 700 });

  const handleUnreadMsgCount = (unread: number) => {
    return unread > 99 ? "99+" : unread;
  };

  return (
    <UserContent onClick={() => onChatRoom(room.uuid)} key={room.chatroomId}>
      {isMoreBoxOpen === room.chatroomId && (
        <MoreBox
          items={moreMenuItems(room)}
          top={10}
          right={30}
          onClose={() => setIsMoreBoxOpen(null)}
        />
      )}
      <Left>
        <ImageWrapper $bgColor={getProfileBgColor(room.targetMemberImg)}>
          <ProfileImage
            data={
              room.blind
                ? `/assets/images/profile/profile_default.svg`
                : `/assets/images/profile/profile${room.targetMemberImg}.svg`
            }
            width={38}
            height={38}
          />
        </ImageWrapper>
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
      <Right
        onClick={(e) => handleMoreBoxOpen(room.chatroomId, room.uuid, room, e)}
      >
        <MoreImage
          src="/assets/icons/three_dots_button.svg"
          width={3}
          height={15}
          alt="상세보기"
        />
      </Right>
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

const ImageWrapper = styled.div<{ $bgColor: string }>`
  position: relative;
  width: 47px;
  height: 47px;
  background: ${(props) => props.$bgColor};
  border-radius: 50%;
`;

const ProfileImage = styled.object`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

const Middle = styled.div`
  min-width: 300px;
  margin-left: 14px;
  @media (max-width: 700px) {
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

  @media (max-width: 700px) {
    width: initial;
  }
`;

const Date = styled.p`
  ${theme.fonts.medium11};
  color: ${theme.colors.gray300};
  margin-right: 12px;
`;

const Right = styled.div`
  padding: 0 7px 0 12px;
`;

const MoreImage = styled(Image)`
  cursor: pointer;
`;
