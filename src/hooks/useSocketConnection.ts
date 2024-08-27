import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { socket } from '@/socket';

export const useSocketConnection = () => {

    useEffect(() => {
        function onConnect() {
            console.log(`SOCKET ID: ${socket.id}`);
            const socketId = socket.id || "";
            localStorage.setItem("gamegooSocketId", socketId);
        }

        function onDisconnect() {
            console.log('소켓 끊김')
        }

        function onMemberInfo(data: any) {
            console.log("====== member-info event listener called ======");
            console.log('Received data:', data);
        }

        function onOnlineFriend(data: any) {
            console.log('friendsList', data)
        }

        // 소켓이 이미 연결되어 있으면 리스너를 등록하기 전에 onConnect 호출
        if (socket.connected) {
            onConnect(); // 직접 호출
        }

        // connect 이벤트 리스너 등록
        socket.on("connect", onConnect);

        // disconnect 이벤트 리스너 등록
        socket.on("disconnect", onDisconnect);

        // member-info 이벤트 리스너
        socket.on("member-info", onMemberInfo);

        socket.on("init-online-friend-list", onOnlineFriend)
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("member-info", onMemberInfo);
            socket.off("init-online-friend-list", onOnlineFriend);
        };
    }, [socket]);
};