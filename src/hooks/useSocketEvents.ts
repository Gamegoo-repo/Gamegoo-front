import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { socket } from '@/socket';

export const useSocketEvents = () => {

  useEffect(() => {
    if (!socket) return;

    const handleEventA = (data: any) => {
        console.log('온라인 친구 목록:', data);
        console.log('온라인 친구 목록:', socket);
        console.log(3)
    };
console.log(1)
    const handleEventB = (data: any) => {
      console.log('Event B received:', data);
    };

    if (socket.connected) {
      socket.on('init-online-friend-list', handleEventA);
      socket.on('eventB', handleEventB);
    } else {
      // socket.on('connect', () => {
        socket.on('init-online-friend-list', handleEventA);
        socket.on('eventB', handleEventB);
      // });
    }

    // return () => {
    //   socket.off('init-online-friend-list', handleEventA);
    //   socket.off('eventB', handleEventB);
    // };

  }, [socket]);
};