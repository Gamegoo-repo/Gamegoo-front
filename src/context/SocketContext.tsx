import React, { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '@/socket';

interface SocketContextProps {
    socket: typeof socket;
    onlineFriends: number[];
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [onlineFriends, setOnlineFriends] = useState<number[]>([]);

    useEffect(() => {
        function onConnect() {
            console.log(`SOCKET ID: ${socket.id}`);
            const socketId = socket.id || '';
            localStorage.setItem('gamegooSocketId', socketId);
        }

        function onDisconnect() {
            console.log('소켓 끊김');
        }

        function onMemberInfo(data: any) {
            console.log('====== member-info event listener called ======');
        }

        function onOnlineFriend(data: any) {
            console.log('friendsList', data);
            setOnlineFriends(data.onlineFriendMemberIdList);
        }

        if (socket.connected) {
            onConnect();
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('member-info', onMemberInfo);
        socket.on('init-online-friend-list', onOnlineFriend);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('member-info', onMemberInfo);
            socket.off('init-online-friend-list', onOnlineFriend);
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineFriends }}>
            {children}
        </SocketContext.Provider>
    );
};