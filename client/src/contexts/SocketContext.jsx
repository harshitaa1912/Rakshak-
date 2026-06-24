import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { connectSocket, disconnectSocket, getSocket } from '../services/socket';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [latestSOS, setLatestSOS] = useState(null);
  const [latestAlert, setLatestAlert] = useState(null);
  
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const socket = connectSocket();
    
    socket.on('new-sos', (sos) => {
      setLatestSOS(sos);
    });
    
    socket.on('sos-updated', (sos) => {
      setLatestSOS(sos);
    });

    socket.on('new-alert', (alert) => {
      setLatestAlert(alert);
    });
    
    return () => {
      socket.off('new-sos');
      socket.off('sos-updated');
      socket.off('new-alert');
      disconnectSocket();
    };
  }, [isAuthenticated]);

  return (
    <SocketContext.Provider value={{ socket: getSocket(), latestSOS, latestAlert }}>
      {children}
    </SocketContext.Provider>
  );
};
