import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { useEffect, useState } from 'react';
import { ChatroomList } from '@/interface/chat';
import { getBadMannerValues, getMannerValues } from '@/api/manner';
import { Mannerstatus } from '@/interface/manner';
import { MoreBoxMenuItems } from '@/interface/moreBox';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenModal } from '@/redux/slices/modalSlice';
import { cancelFriendReq, deleteFriend, reqFriend } from '@/api/friends';
import { RootState } from '@/redux/store';
import { getChatrooms } from '@/api/chat';
import ChatRoomItem from './ChatRoomItem';
import useChatMessage from '@/hooks/useChatMessage';
import { setCurrentChatUuid } from '@/redux/slices/chatSlice';

interface ChatRoomListProps {
    onChatRoom: (id: string) => void;
    activeTab: number;
}

const ChatRoomList = (props: ChatRoomListProps) => {
    const { onChatRoom, activeTab } = props;

    const dispatch = useDispatch();

    const isUser = useSelector((state: RootState) => state.user);
    const isModalType = useSelector((state: RootState) => state.modal.modalType);

    const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);
    const [reloadChatrooms, setReloadChatrooms] = useState(false);
    const [isMoreBoxOpen, setIsMoreBoxOpen] = useState<number | null>(null);
    const [isUuid, setIsUuid] = useState("");
    const [selectedChatroom, setSelectedChatroom] = useState<ChatroomList | null>(null);
    const [isMannerStatus, setIsMannerStatus] = useState<Mannerstatus | undefined>();
    const [isBadMannerStatus, setIsBadMannerStatus] = useState<Mannerstatus | undefined>();
    const [targetMemberId, setTargetMemberId] = useState<number | null>(null);
    const [isMemberId, setIsMemberId] = useState<number>();

    const { newMessage } = useChatMessage();

    /* 대화방 목록 가져오기  */
    useEffect(() => {
        const handleFetchChatrooms = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result.chatroomViewDTOList);
                dispatch(setCurrentChatUuid(''));
            } catch (error) {
                console.error(error);
            }
        };

        handleFetchChatrooms();
    }, [isModalType, reloadChatrooms, activeTab])

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

    /* 더보기 버튼 여닫기 */
    const handleMoreBoxOpen = (chatId: number, uuid: string, room: ChatroomList, e: React.MouseEvent) => {
        handleMannerValuesGet(room.targetMemberId);
        handleBadMannerValuesGet(room.targetMemberId);

        e.stopPropagation();
        if (isMoreBoxOpen === chatId) {
            setIsMoreBoxOpen(null);
        } else {
            setIsUuid(uuid);
            setIsMoreBoxOpen(chatId);
            setSelectedChatroom(room);
        };
    };

    /* 매너평가 조회 */
    const handleMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getMannerValues(memberId);
            await setIsMannerStatus(response.result);
        } catch (error) {
            console.error(error);
        }
    };

    /* 비매너평가 조회 */
    const handleBadMannerValuesGet = async (memberId: number) => {
        try {
            const response = await getBadMannerValues(memberId);
            await setIsBadMannerStatus(response.result);
            console.log(response.result)
        } catch (error) {
            console.error(error);
        }
    };

    /* 모달 타입 변경 */
    const handleChangeModal = async (e: React.MouseEvent, type: string, targetMemberId?: number) => {
        if (type) {
            e.stopPropagation();
        }

        if (targetMemberId !== undefined) {
            await setTargetMemberId(targetMemberId);
            setIsMemberId(targetMemberId);
        }

        dispatch(setOpenModal(type));
        setIsMoreBoxOpen(null);
    };

    /* 신고하기 */
    const handleReportClick = (e: React.MouseEvent, targetMemberId: number) => {
        handleChangeModal(e, 'report', targetMemberId);
    };

    /* 매너 평가하기 */
    const handleMannerClick = (e: React.MouseEvent, targetMemberId: number) => {
        handleChangeModal(e, 'manner', targetMemberId);
    };

    /* 비매너 평가하기 */
    const handleBadMannerClick = (e: React.MouseEvent, targetMemberId: number) => {
        handleChangeModal(e, 'badManner', targetMemberId);
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
            { text: `신고하기`, onClick: (e) => handleReportClick(e, room.targetMemberId) },
            { text: `매너 평가`, onClick: (e) => handleMannerClick(e, room.targetMemberId) },
            { text: `비매너 평가`, onClick: (e) => handleBadMannerClick(e, room.targetMemberId) }
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
        <List>
            {chatrooms?.map(room => {
                return (
                    <ChatRoomItem
                        key={room.uuid}
                        room={room}
                        onChatRoom={(id) => onChatRoom(id)}
                        isMoreBoxOpen={isMoreBoxOpen}
                        handleMoreBoxOpen={handleMoreBoxOpen}
                        generateMenuItems={generateMenuItems} />
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

