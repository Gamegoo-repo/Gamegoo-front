import { useEffect } from 'react';
import { connectSocket, socket } from '@/socket';
import { getChatrooms } from '@/api/chat';
import { ChatroomList } from '@/interface/chat';

const useChatList = (setChatrooms: (chatrooms: ChatroomList[]) => void) => {

    useEffect(() => {
        // 소켓 연결되어 있지 않으면 소켓 연결
        if (!socket) {
             connectSocket();
        }

        const handleJoinedNewChatroom = async () => {
            try {
                const data = await getChatrooms();
                setChatrooms(data.result);
            } catch (error) {
                console.error(error);
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