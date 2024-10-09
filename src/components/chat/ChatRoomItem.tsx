import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { getProfileBgColor } from '@/utils/profile';
import { ChatroomList } from '@/interface/chat';
import MoreBox from '../common/MoreBox';
import { setChatRoomDateFormatter } from '@/utils/custom';
import { MoreBoxMenuItems } from '@/interface/moreBox';

interface ChatRoomItemProps {
    room: ChatroomList;
    onChatRoom: (id: string) => void;
    isMoreBoxOpen: number | null;
    handleMoreBoxOpen: (chatId: number, uuid: string, room: ChatroomList, e: React.MouseEvent) => void;
    moreMenuItems: (room: ChatroomList) => MoreBoxMenuItems[];
}

const ChatRoomItem = (props: ChatRoomItemProps) => {
    const {
        room,
        onChatRoom,
        isMoreBoxOpen,
        handleMoreBoxOpen,
        moreMenuItems,
    } = props;

    const handleUnreadMsgCount = (unread: number) => {
        return unread > 99 ? '99+' : unread;
    };

    return (
        <UserContent
            onClick={() => onChatRoom(room.uuid)}
            key={room.chatroomId}>
            {isMoreBoxOpen === room.chatroomId &&
                <MoreBox
                    items={moreMenuItems(room)}
                    top={10}
                    left={208}
                />
            }
            <Left>
                <ImageWrapper $bgColor={getProfileBgColor(room.targetMemberImg)}>
                    <ProfileImage
                        data={room.blind ? `/assets/images/profile/profile_default.svg` : `/assets/images/profile/profile${room.targetMemberImg}.svg`}
                        width={38}
                        height={38} />
                </ImageWrapper>
                <Middle>
                    <Row>
                        <UserName>{room.targetMemberName}</UserName>
                        {room.notReadMsgCnt !== 0 &&
                            <Unread>{handleUnreadMsgCount(room.notReadMsgCnt)}</Unread>
                        }
                    </Row>
                    <Row>
                        <Msg>{room.lastMsg}</Msg>
                        <Date>{setChatRoomDateFormatter(room.lastMsgAt)}</Date>
                    </Row>
                </Middle>
            </Left>
            <Right
                onClick={(e) => handleMoreBoxOpen(room.chatroomId, room.uuid, room, e)}>
                <MoreImage
                    src="/assets/icons/three_dots_button.svg"
                    width={3}
                    height={15}
                    alt="상세보기" />
            </Right>
        </UserContent>
    )
};

export default ChatRoomItem;

const UserContent = styled.div`
  position: relative;
  display: flex;  
  justify-content: space-between;
  cursor: pointer;
  padding:18px 12px 18px 0;
  &:hover {
    background: ${theme.colors.gray500}; 
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
    top:50%;
    left:50%;
    transform: translate(-50%, -50%);
`;

const Middle = styled.div`
    min-width: 300px;
    margin-left: 14px;
`;

const UserName = styled.p`
    ${(props) => props.theme.fonts.semiBold14};
    color:${theme.colors.gray600}; 
`;

const Unread = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:${theme.colors.white};  
    padding:0 5px;
    border-radius: 38px;
    background:${theme.colors.purple100};
`;

const Row = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-between;
`;

const Msg = styled.p`
    ${(props) => props.theme.fonts.regular14};
    color:${theme.colors.gray600};  
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 215px;
`;

const Date = styled.p`
    ${(props) => props.theme.fonts.medium11};
    color:#C1C1C1;
    margin-right: 12px;
`;

const Right = styled.div`
    padding: 0 7px 0 12px;
`;

const MoreImage = styled(Image)`
    cursor: pointer;
`;