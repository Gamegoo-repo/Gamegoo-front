import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, socket } from '@/socket';
import { setFriendOffline, setFriendOnline, setMemberId } from '@/redux/slices/chatSlice';

const useChatFriend = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        // 소켓 연결되어 있지 않으면 소켓 연결
        if (!socket) {
             connectSocket();
        }

        const handleMemberInfo = (res: any) => {
            const memberId = res.data.memberId;
            dispatch(setMemberId(memberId));
        };
        const handleInitOnlineFriend = (res: any) => {
            const onlineFriendsList = res.data.onlineFriendMemberIdList;
            dispatch(setFriendOnline(onlineFriendsList));

        };
        const handleOnlineFriend = (res: any) => {
            const onlineFriendId = res.data.memberId;
            dispatch(setFriendOnline(onlineFriendId));
            // alert(`온라인 이벤트 ${onlineFriendId}`);
            console.log(`온라인 이벤트 ${onlineFriendId}`);
        };
        const handleOfflineFriend = (res: any) => {
            const offlineFriendId = res.data.memberId;
            dispatch(setFriendOffline(offlineFriendId));
            // alert(`오프라인 이벤트 ${offlineFriendId}`);
            console.log(`오프라인 이벤트 ${offlineFriendId}`);
        };

        socket?.on("member-info", handleMemberInfo);
        socket?.on("init-online-friend-list", handleInitOnlineFriend);
        socket?.on("friend-online", handleOnlineFriend);
        socket?.on("friend-offline", handleOfflineFriend);

        return () => {
            socket?.off("member-info", handleMemberInfo);
            socket?.off("init-online-friend-list", handleInitOnlineFriend);
            socket?.off("friend-online", handleOnlineFriend);
            socket?.off("friend-offline", handleOfflineFriend);
        };
    }, [dispatch]);

};

export default useChatFriend;