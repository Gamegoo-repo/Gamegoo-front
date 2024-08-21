import styled from 'styled-components';
import { theme } from "@/styles/theme";
import Image from 'next/image';
import { setChatRoomDateFormatter } from '@/utils/custom';
import { Dispatch, useEffect, useState } from 'react';
import MoreBox from '../common/MoreBox';
import { MoreBoxMenuItems } from '@/interface/moreBox';
import { ChatroomList } from '@/interface/chat';
import { getProfileBgColor } from '@/utils/profile';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { cancelFriendReq, deleteFriend, reqFriend } from '@/api/friends';

interface ChatListProps {
    onChatRoom: (uuid: string) => void;
    setIsMoreBoxOpen: Dispatch<React.SetStateAction<number | null>>;
    isMoreBoxOpen: number | null;
    onModalChange: (modalType: string) => void;
    isUuid: (uuid: string) => void;
    chatrooms: ChatroomList[];
    onSelectChatroom: (chatroom: ChatroomList) => void;
    triggerReloadChatrooms: () => void;
    onMemberId: (id: number) => void;
}

const ChatList = (props: ChatListProps) => {
    const {
        onChatRoom,
        setIsMoreBoxOpen,
        isMoreBoxOpen,
        onModalChange,
        isUuid,
        chatrooms,
        onSelectChatroom,
        triggerReloadChatrooms,
        onMemberId,
    } = props;

    const isModalType = useSelector((state: RootState) => state.modal.modalType);
    const isUser = useSelector((state: RootState) => state.user);

    /* 더보기 버튼 여닫기 */
    const handleMoreBoxOpen = (chatId: number, uuid: string, room: ChatroomList, e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            isUuid(uuid);
            setIsMoreBoxOpen(chatId);
            onSelectChatroom(room);
        };
    };

    /* 친구 추가 */
    const handleFriendAdd = async (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();
        try {
            await reqFriend(memberId);
            triggerReloadChatrooms();
        } catch (error) {
            console.log('에러', error);
        }

        if (setIsMoreBoxOpen) {
            setIsMoreBoxOpen(null);
        }
    };

    /* 친구 삭제 */
    const handleFriendDelete = async (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();

        try {
            await deleteFriend(memberId);
            triggerReloadChatrooms();
        } catch (error) {
            console.log('에러', error);
        }
    }
    /* 친구 요청 취소 */
    const handleCancelFriendReq = async (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();

        try {
            await cancelFriendReq(memberId);
            triggerReloadChatrooms();
        } catch (error) {
            console.log('에러', error);
        }
    }

    /* 모달 타입 변경 */
    const handleChangeModal = (e: React.MouseEvent, type: string) => {
        if (type) {
            e.stopPropagation();
        }

        onModalChange(type);
    };

    /* 더보기 버튼 친구 관련 함수 */
    const handleFriendAction = (e: React.MouseEvent, room: ChatroomList) => {
        setIsMoreBoxOpen(null);

        if (room.friend) {
            // 친구 삭제
            handleFriendDelete(e, room.targetMemberId);
        } else if (room.friendRequestMemberId) {
            //친구 요청 취소
            handleCancelFriendReq(e, room.targetMemberId);
        } else {
            // 친구 추가
            handleFriendAdd(e, room.targetMemberId);
        }
    };

    /* 더보기 버튼 상태 */
    const generateMenuItems = (room: ChatroomList): MoreBoxMenuItems[] => {
        onMemberId(room.targetMemberId);

        let friendText = '';

        // 친구 상태에 따른 텍스트 설정 및 버튼 표시 여부
        if (room.friend) {
            friendText = '친구 삭제';
        } else if (room.friend) {
            friendText = '친구 삭제';
        } else if (room.friendRequestMemberId && room.friendRequestMemberId === isUser.id) {
            friendText = '친구 요청 취소';
        } else if (!room.friend && (!room.friendRequestMemberId || room.friendRequestMemberId !== isUser.id)) {
            friendText = '친구 추가';
        }

        const items: MoreBoxMenuItems[] = [
            { text: `채팅방 나가기`, onClick: (e) => handleChangeModal(e, 'leave') },
        ];

        // friendText가 빈 문자가 아닐 때만 버튼 추가
        if (friendText) {
            items.push({ text: friendText, onClick: (e) => handleFriendAction(e, room) });
        }

        items.push(
            { text: `차단하기`, onClick: (e) => handleChangeModal(e, 'block') },
            { text: `신고하기`, onClick: (e) => handleChangeModal(e, 'report') },
            { text: `매너 평가`, onClick: (e) => handleChangeModal(e, 'manner') },
            { text: `비매너 평가`, onClick: (e) => handleChangeModal(e, 'badManner') }
        );

        return items;
    };

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
                                    items={generateMenuItems(room)}
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
                                onClick={(e) => handleMoreBoxOpen(room.chatroomId, room.uuid, room, e)}>
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