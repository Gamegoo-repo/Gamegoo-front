import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { socket } from '@/socket';
import { setFriendOffline, setFriendOnline, setMemberId } from '@/redux/slices/chatSlice';

const useChatFriend = () => {
    const dispatch = useDispatch();

    useEffect(() => {
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
        };
        const handleOfflineFriend = (res: any) => {
            const offlineFriendId = res.data.memberId;
            dispatch(setFriendOffline(offlineFriendId));
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