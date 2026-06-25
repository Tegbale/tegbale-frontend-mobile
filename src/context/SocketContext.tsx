import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, TOKEN_KEY } from '../services/api';
import { useAuth } from './AuthContext';

type SocketContextValue = {
  socket: Socket | null;
  notifCount: number;
  setNotifCount: React.Dispatch<React.SetStateAction<number>>;
};

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  notifCount: 0,
  setNotifCount: () => {},
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!user) {
      setSocket(prev => {
        prev?.disconnect();
        return null;
      });
      setNotifCount(0);
      return;
    }

    let s: Socket;

    AsyncStorage.getItem(TOKEN_KEY).then(token => {
      if (!token) return;

      s = io(API_BASE_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      s.on('notification:count', ({ count }: { count: number }) => {
        setNotifCount(count);
      });

      setSocket(s);
    });

    return () => {
      s?.disconnect();
      setSocket(null);
      setNotifCount(0);
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider value={{ socket, notifCount, setNotifCount }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
