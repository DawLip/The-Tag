import config from '@/config';
import { createContext, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

type SocketContextType = Socket | null;
export const SocketContext = createContext<SocketContextType>(null);

export const socket = io(config.urls.server, { transports: ['websocket'] });

export const useSocket = () => useContext(SocketContext);