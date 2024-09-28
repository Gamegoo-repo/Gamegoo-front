import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { socket } from '@/socket';
import { setUnreadUuid } from '@/redux/slices/chatSlice';
import { markChatAsRead } from '@/api/chat';
import { SystemMessage, ChatMessageDto } from '@/interface/chat';

const useChatMessage = () => {
    const dispatch = useDispatch();
    const [newMessage, setNewMessage] = useState<ChatMessageDto | null>(null);
    const [systemMessage, setSystemMessage] = useState<SystemMessage | null>(null);

    const currentChatUuid = useSelector((state: RootState) => state.chat.currentChatUuid);
    const unreadChatUuids = useSelector((state: RootState) => state.chat.unreadUuids);

    useEffect(() => {
        const handleChatMessage = (res: any) => {
            const chatroomUuid = res.data.chatroomUuid;
            const newChatTimestamp = res.data.timestamp;
            /* 현재 보고 있는 채팅방 읽음 처리 */
            if (currentChatUuid && chatroomUuid === currentChatUuid) {
                markChatAsRead(currentChatUuid, newChatTimestamp);
            }

            /* 안 읽은 채팅방 처리 */
            if (
                // 현재 채팅방과 새로 메시지가 온 채팅방이 다를 경우 (=== 새로온 메시지가 온 채팅방을 보고 있지 않은 경우)
                currentChatUuid !== chatroomUuid ||
                // 안읽은 uuid 목록에 새로 메시지가 온 채팅방이 없을 경우
                !unreadChatUuids.includes(chatroomUuid)
            ) {
                // 안읽은 uuid 목록에 새로 메시지가 온 채팅방이 없을 경우에만 새로운 채팅을 안읽은 uuid 목록에 추가 (중복해서 채팅이 보내질 떄, 같은 uuid가 추가되는 것 방지)
                if (!unreadChatUuids.includes(chatroomUuid)) {
                    const updatedUnreadUuids = [...unreadChatUuids, chatroomUuid];
                    // 실시간 안읽은 채팅방 수 가져오기 위함
                    dispatch(setUnreadUuid(updatedUnreadUuids));

                    //TODO: 로그아웃할 때 unreadChatUuids값 지우기.
                    // 새로고침시 채팅방 수 가져오기 위함
                    localStorage.setItem('unreadChatUuids', JSON.stringify(updatedUnreadUuids));
                }
            }
            setNewMessage(res.data);
        };

        const handleMyMessage = (res: any) => {
            const newMessage = res.data;
            // 새로운 메시지 저장 (내가 쓴 메시지)
            setNewMessage(newMessage);
        };

        const handleSystemMessage = (res: any) => {
            const systemMessage = res.data;
            setSystemMessage(systemMessage);
        };

        socket?.on("chat-message", handleChatMessage);
        socket?.on("my-message-broadcast-success", handleMyMessage);
        socket?.on("chat-system-message", handleSystemMessage);

        return () => {
            socket?.off("chat-message", handleChatMessage);
            socket?.off("my-message-broadcast-success", handleMyMessage);
            socket?.off("chat-system-message", handleSystemMessage);
        };
    }, [currentChatUuid, unreadChatUuids, dispatch]);

    return { newMessage, systemMessage };
};

export default useChatMessage;