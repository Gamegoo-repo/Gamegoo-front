import styled from 'styled-components';
import { theme } from "@/styles/theme";
import { useEffect, useState } from 'react';
import { ChatroomList } from '@/interface/chat';
import { MoreBoxMenuItems } from '@/interface/moreBox';
import { useDispatch, useSelector } from 'react-redux';
import {  setOpenModal } from '@/redux/slices/modalSlice';
import { cancelFriendReq, deleteFriend, reqFriend } from '@/api/friends';
import { RootState } from '@/redux/store';
import { getChatrooms } from '@/api/chat';
import ChatRoomItem from './ChatRoomItem';
import useChatMessage from '@/hooks/useChatMessage';
import { setCurrentChatUuid } from '@/redux/slices/chatSlice';

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

    const isUser = useSelector((state: RootState) => state.user);
    const isModalType = useSelector((state: RootState) => state.modal.modalType);

    const [chatrooms, setChatrooms] = useState<ChatroomList[]>([]);
    const [reloadChatrooms, setReloadChatrooms] = useState(false);
    const [targetMemberId, setTargetMemberId] = useState<number | null>(null);
    const [isMemberId, setIsMemberId] = useState<number>();

    const { newMessage } = useChatMessage();

    /* 대화방 목록 가져오기  */
    useEffect(() => {
        const handleFetchChatrooms = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result.chatroomViewDTOList);
                // 채팅방 읽음처리 하지 않기 위함
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

    /* 모달 타입 변경 */
    const handleChangeModal = async (e: React.MouseEvent, type: string, targetMemberId?: number) => {
        if (type) {
            e.stopPropagation();
        }

        // if (targetMemberId !== undefined) {
        //     await setTargetMemberId(targetMemberId);
        //     setIsMemberId(targetMemberId);
        // }

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

    /* 더보기 버튼 친구 관련 */
    const handleFriendAction = (e: React.MouseEvent, room: ChatroomList) => {
        setIsMoreBoxOpen(null);

        if (room.friend) {
            // 친구 삭제
            handleFriendDelete(e, room.targetMemberId);
        } else if (!room.friend && room.friendRequestMemberId) {
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
        } else if (!room.friend && room.friendRequestMemberId) {
            friendText = '친구 요청 취소';
        } else if (!room.friend && !room.friendRequestMemberId) {
            friendText = '친구 추가';
        }

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

const CheckContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ModalSubmitBtn = styled.div`
  margin-top:52px;
`;

const ReportLabel = styled.p`
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.semiBold18};
  margin-bottom: 12px;
`;

const ReportContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const ReportReasonContent = styled(ReportContent)`
  margin-bottom: 38px;
`;

const ReportButton = styled.div`
  margin-top:21px;
`;

const Text = styled.div`
  text-align: center;
  color: ${theme.colors.gray600};
  ${(props) => props.theme.fonts.regular20};
  margin: 28px 0;
`;

const SmallText = styled.div`
  text-align: center;
  color: ${theme.colors.gray200};
  ${(props) => props.theme.fonts.regular14};
  margin-top: 13px;
`;

const MsgConfirm = styled(Text)`
  ${(props) => props.theme.fonts.regular25};
  margin: 80px 0;
`;

