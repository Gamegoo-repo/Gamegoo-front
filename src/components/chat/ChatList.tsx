import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatRoomDateFormatter } from '@/utils/custom';
import { Dispatch, useEffect, useState } from 'react';
import MoreBox from '../common/MoreBox';
import { MoreBoxMenuItems } from '@/interface/moreBox';
import { getChatrooms } from '@/api/chat';
import { ChatroomList } from '@/interface/chat';
import { getProfileBgColor } from '@/utils/profile';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface ChatListProps {
    onChatRoom: (uuid: string) => void;
    setIsMoreBoxOpen: Dispatch<React.SetStateAction<number | null>>;
    isMoreBoxOpen: number | null;
    onModalChange: (modalType: string) => void;
    isUuid: (uuid: string) => void;
}

const ChatList = (props: ChatListProps) => {
    const { onChatRoom, setIsMoreBoxOpen, isMoreBoxOpen, onModalChange, isUuid } = props;

    const isModalType = useSelector((state: RootState) => state.modal.modalType);

    const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);

    /* 대화창 목록 가져오기  */
    useEffect(() => {
        const handleFetchChatrooms = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result);
            } catch (error) {
                console.error("에러:", error);
            }
        };

        handleFetchChatrooms();
    }, [isModalType])

    const handleMoreBoxOpen = (chatId: number, uuid: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            isUuid(uuid);
            setIsMoreBoxOpen(chatId);
        };
    };

    /* 친구 추가 */
    const handleFriendAdd = (e: React.MouseEvent) => {
        e.stopPropagation();

        if (setIsMoreBoxOpen) {
            setIsMoreBoxOpen(null);
        }
        console.log('친구 추가')
    };

    const handleChangeModal = (e: React.MouseEvent, type: string) => {
        if (type) {
            e.stopPropagation();
        }

        onModalChange(type);
    };

    const menuItems: MoreBoxMenuItems[] = [
        { text: '채팅방 나가기', onClick: (e) => handleChangeModal(e, 'leave') },
        { text: '친구 추가', onClick: (e) => handleFriendAdd(e) },
        { text: '차단하기', onClick: (e) => handleChangeModal(e, 'block') },
        { text: '신고하기', onClick: (e) => handleChangeModal(e, 'report') },
        { text: '매너 평가', onClick: (e) => handleChangeModal(e, 'manner') },
        { text: '비매너 평가', onClick: (e) => handleChangeModal(e, 'badManner') },
    ];

    return (
        <>
            <List>
                {chatrooms.map(room => {
                    return (
                        <UserContent
                            onClick={() =>
                                onChatRoom(room.uuid)}
                            key={room.chatroomId}>
                            {isMoreBoxOpen === room.chatroomId &&
                                <MoreBox
                                    items={menuItems}
                                    top={10}
                                    left={208}
                                />
                            }
                            <Left>
                                <ImageWrapper $bgColor={getProfileBgColor(room.targetMemberImg)}>
                                    <ProfileImage
                                        src={`/assets/images/profile/profile${room.targetMemberImg}.svg`}
                                        width={38}
                                        height={38}
                                        alt="사용자 프로필" />
                                </ImageWrapper>
                                <Middle>
                                    <Row>
                                        <UserName>{room.targetMemberName}</UserName>
                                        {room.notReadMsgCnt !== 0 &&
                                            <Unread>{room.notReadMsgCnt}</Unread>
                                        }
                                    </Row>
                                    <Row>
                                        <Msg>{room.lastMsg}</Msg>
                                        <Date>{setChatRoomDateFormatter(room.lastMsgAt)}</Date>
                                    </Row>
                                </Middle>
                            </Left>
                            <Right
                                onClick={(e) => handleMoreBoxOpen(room.chatroomId, room.uuid, e)}>
                                <MoreImage
                                    src="/assets/icons/three_dots_button.svg"
                                    width={3}
                                    height={15}
                                    alt="상세보기" />
                            </Right>
                        </UserContent>
                    )
                })}
            </List>

        </>
    )
};

export default ChatList;

const List = styled.div`
`;

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

const ProfileImage = styled(Image)`
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