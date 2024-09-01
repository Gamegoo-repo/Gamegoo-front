import { useEffect } from 'react';
import { socket } from '@/socket';
import { getChatrooms } from '@/api/chat';
import { ChatroomList } from '@/interface/chat';

const useChatList = (isChatListVisible: boolean, setChatrooms: (chatrooms: ChatroomList[]) => void) => {
    useEffect(() => {
        const handleJoinedNewChatroom = async () => {
            if (isChatListVisible) {
                try {
                    const data = await getChatrooms();
                    setChatrooms(data.result);
                } catch (error) {
                    console.error("Failed to fetch chat rooms:", error);
                }
            }
        };

        if (isChatListVisible) {
            socket.on('joined-new-chatroom', handleJoinedNewChatroom);
        }

        return () => {
            if (isChatListVisible) {
                socket.off('joined-new-chatroom', handleJoinedNewChatroom);
            }
        };
    }, [isChatListVisible, setChatrooms]);
};

export default useChatList;