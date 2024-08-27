import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';

export const socket = io(SOCKET_URL);


