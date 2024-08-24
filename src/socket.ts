import { io } from 'socket.io-client';
import { SOCKET_URL } from './api';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.NODE_ENV === 'production' ? undefined : SOCKET_URL;

export const socket = io(SOCKET_URL);