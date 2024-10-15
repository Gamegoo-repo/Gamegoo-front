import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { useEffect, useState } from 'react';
import { ChatroomList } from '@/interface/chat';
import { MoreBoxMenuItems } from '@/interface/moreBox';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModal } from '@/redux/slices/modalSlice';
import { cancelFriendReq, deleteFriend, reqFriend } from '@/api/friends';
import { RootState } from '@/redux/store';
import { getChatrooms } from '@/api/chat';
import ChatRoomItem from './ChatRoomItem';
import useChatMessage from '@/hooks/useChatMessage';
import { setCurrentChatUuid } from '@/redux/slices/chatSlice';
import useChatList from '@/hooks/useChatList';

interface ChatRoomListProps {
    onChatRoom: (id: string) => void;
    activeTab: number;
    isMoreBoxOpen: number | null;
    setIsMoreBoxOpen: React.Dispatch<React.SetStateAction<number | null>>;
    handleMoreBoxOpen: (chatId: number, uuid: string, room: ChatroomList, e: React.MouseEvent) => void;
}

const ChatRoomList = (props: ChatRoomListProps) => {
    const { onChatRoom, activeTab, isMoreBoxOpen, setIsMoreBoxOpen, handleMoreBoxOpen } = props;

    const dispatch = useDispatch();

    const isModalType = useSelector((state: RootState) => state.modal.modalType);
    const isUser = useSelector((state: RootState) => state.user);

    const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);
    const [reloadChatrooms, setReloadChatrooms] = useState(false);
    const [cursor, setCursor] = useState<number | null>(null);
    const [hasNext, setHasNext] = useState<boolean>(true);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { newMessage, mannerSystemMessage } = useChatMessage();

    /* 채팅방 목록 화면이 열려 있을 때만 joined-new-chatroom 이벤트를 리스닝 */
    useChatList(setChatrooms);

    /* 대화방 목록 가져오기  */
    const handleFetchChatrooms = async (cursor?: number) => {
        setIsLoading(true);
        try {
            const data = await getChatrooms(cursor);
            setChatrooms(data.result.chatroomViewDTOList);
            setHasNext(data.result.has_next);
            setCursor(data.result.next_cursor);
            // 채팅방 읽음처리 하지 않기 위함
            dispatch(setCurrentChatUuid(''));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        handleFetchChatrooms();
    }, [isModalType, reloadChatrooms, activeTab, mannerSystemMessage])

    /* 대화 목록 페이지 - 스크롤이 끝에 도달하면 다음 페이지 가져오기 */
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (!cursor) return;
        const bottom = e.currentTarget.scrollHeight - e.currentTarget.scrollTop === e.currentTarget.clientHeight;
        if (hasNext && bottom && !isLoading) {
            handleFetchChatrooms(cursor);
        }
    };

    /* 상태 변경하여 useEffect 트리거 */
    const triggerReloadChatrooms = () => {
        setReloadChatrooms(prev => !prev);
    };

    /* 새 메시지 오면 대화방 목록 업데이트 */
    useEffect(() => {
        if (newMessage) {
            triggerReloadChatrooms();
        }
    }, [newMessage]);

    /* 모달 타입 변경 */
    const handleChangeModal = async (e: React.MouseEvent, type: string) => {
        if (type) {
            e.stopPropagation();
        }

        dispatch(setOpenModal(type));
        setIsMoreBoxOpen(null);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent) => {
        handleChangeModal(e, 'report');
    };

    /* 매너 평가하기 */
    const handleMannerClick = (e: React.MouseEvent) => {
        handleChangeModal(e, 'manner');
    };

    /* 비매너 평가하기 */
    const handleBadMannerClick = (e: React.MouseEvent) => {
        handleChangeModal(e, 'badManner');
    };

    /* 더보기 버튼 친구 관련 */
    const handleFriendAction = (e: React.MouseEvent, room: ChatroomList) => {
        setIsMoreBoxOpen(null);

        if (room.friend) {
            // 친구 삭제
            handleFriendDelete(e, room.targetMemberId);
        } else if (!room.friend && room.friendRequestMemberId === isUser.id) {
            //친구 요청 취소
            handleCancelFriendReq(e, room.targetMemberId);
        } else if (!room.friend) {
            // 친구 추가
            handleFriendAdd(e, room.targetMemberId);
        }
    };

    /* 더보기 버튼 상태 */
    const moreMenuItems = (room: ChatroomList): MoreBoxMenuItems[] => {
        const items: MoreBoxMenuItems[] = [
            { text: `채팅방 나가기`, onClick: (e) => handleChangeModal(e, 'leave') },
        ];

        if (!!room.blind) {
            return items;
        }

        let friendText = '';

        if (room.friend) {
            friendText = '친구 삭제';
        } else if (!room.friend && room.friendRequestMemberId === isUser.id) {
            friendText = '친구 요청 취소';
        } else if (!room.friend) {
            friendText = '친구 추가';
        }

        if (friendText) {
            items.push({ text: friendText, onClick: (e) => handleFriendAction(e, room) });
        }

        items.push(
            { text: `차단하기`, onClick: (e) => handleChangeModal(e, 'block') },
            { text: `신고하기`, onClick: handleReportClick },
            { text: `매너 평가`, onClick: handleMannerClick },
            { text: `비매너 평가`, onClick: handleBadMannerClick }
        );

        return items;
    };

    /* 친구 추가 */
    const handleFriendAdd = async (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();
        try {
            await reqFriend(memberId);
            triggerReloadChatrooms();
        } catch (error) {
            console.error(error);
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
            console.error(error);
        }
    };

    /* 친구 요청 취소 */
    const handleCancelFriendReq = async (e: React.MouseEvent, memberId: number) => {
        e.stopPropagation();

        try {
            await cancelFriendReq(memberId);
            triggerReloadChatrooms();
        } catch (error) {
            console.error(error);
        }
    };

    if (chatrooms.length === 0) {
        return <NoData>{`생성된 대화방이 없습니다.`}</NoData>;
    }

    return (
        <List onScroll={handleScroll}>
            {chatrooms?.map(room => {
                return (
                    <ChatRoomItem
                        key={room.uuid}
                        room={room}
                        onChatRoom={(id) => onChatRoom(id)}
                        isMoreBoxOpen={isMoreBoxOpen}
                        handleMoreBoxOpen={handleMoreBoxOpen}
                        moreMenuItems={moreMenuItems} />
                )
            })}
        </List>
    )
};

export default ChatRoomList;

const List = styled.div``;

const NoData = styled.p`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular16};
  margin-top:50%;
`;


