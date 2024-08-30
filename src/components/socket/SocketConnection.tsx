import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '@/socket';
import { friendOffline, friendOnline, memberId } from '@/redux/slices/chatSlice';
import useChatMessage from '@/hooks/useChatMessage';

const SocketConnection: React.FC = () => {
    const dispatch = useDispatch();

    useChatMessage();

    useEffect(() => {
        function onConnect() {
            console.log(`SOCKET ID: ${socket.id}`);
            const socketId = socket.id || "";
            localStorage.setItem("gamegooSocketId", socketId);
        }

        function onDisconnect() {
            console.log('소켓 끊김');
        }

        if (socket.connected) {
            onConnect();
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);

        socket.on("member-info", async (res, cb) => {
            try {
                dispatch(memberId(res.data.memberId));
            } catch (error) {
                cb({ ok: false, error: error });
            }
        });

        socket.on("init-online-friend-list", async (res, cb) => {
            try {
                const onlineFriendsList = res.data.onlineFriendMemberIdList;
                dispatch(friendOnline(onlineFriendsList));
            } catch (error) {
                cb({ ok: false, error: error });
            }
        });

        socket.on("friend-online", async (res, cb) => {
            try {
                const onlineFriendId = res.data.memberId;
                dispatch(friendOnline(onlineFriendId));
            } catch (error) {
                cb({ ok: false, error: error });
            }
        });

        socket.on("friend-offline", async (res, cb) => {
            try {
                const onlineFriendId = res.data.memberId;
                dispatch(friendOffline(onlineFriendId));
            } catch (error) {
                cb({ ok: false, error: error });
            }
        });

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("member-info");
            socket.off("init-online-friend-list");
            socket.off("friend-online");
            socket.off("friend-offline");
        };
    }, [dispatch]);

    return null;
};

export default SocketConnection;