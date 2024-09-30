import { useEffect } from 'react';
import { socket } from '@/socket';
import { getChatrooms } from '@/api/chat';
import { ChatroomList } from '@/interface/chat';

const useChatList = (setChatrooms: (chatrooms: ChatroomList[]) => void) => {
    useEffect(() => {
        const handleJoinedNewChatroom = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result);
            } catch (error) {
                console.error("Failed to fetch chat rooms:", error);
            }
        };

        if (socket) {
            socket.on('joined-new-chatroom', handleJoinedNewChatroom);
        }

        return () => {
            if (socket) {
                socket.off('joined-new-chatroom', handleJoinedNewChatroom);
            }
        };
    }, [setChatrooms]);
};

export default useChatList;