import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { playReadyChime } from '../utils/audioAlert';

const SocketContext = createContext(null);

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL.trim().replace(/\/+$/, '');
  }
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.trim().replace(/\/+$/, '');
    return raw.replace(/\/api$/, '');
  }
  return 'http://localhost:5000';
};

const SOCKET_URL = getSocketUrl();

export const SocketProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveAlert, setLiveAlert] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    if (user?.id) {
      socket.emit('join_user', user.id);
    }

    if (isAdmin) {
      socket.emit('join_admin');
    }

    // High priority Ready notification listener
    const handleStatusUpdated = (data) => {
      if (data.status === 'READY' || data.isHighPriority) {
        playReadyChime();
        setLiveAlert({
          type: 'READY',
          title: data.title || 'Your Order is Ready!',
          message: data.message || 'Please collect your food at the canteen counter.',
          orderId: data.orderId,
          timestamp: Date.now()
        });
      } else {
        setLiveAlert({
          type: data.status,
          title: data.title || 'Order Update',
          message: data.message,
          orderId: data.orderId,
          timestamp: Date.now()
        });
      }
    };

    // Completed listener
    const handleCompleted = (data) => {
      setLiveAlert({
        type: 'COMPLETED',
        title: 'Order Completed!',
        message: data.message,
        orderId: data.orderId,
        timestamp: Date.now()
      });
    };

    // Admin incoming order listener
    const handleNewOrder = (data) => {
      if (isAdmin) {
        playReadyChime();
        setLiveAlert({
          type: 'NEW_ORDER',
          title: '🔔 New Paid Order Received!',
          message: data.message || `Order #${data.order?.displayNumber || ''} is waiting for acceptance.`,
          orderId: data.order?.id,
          timestamp: Date.now()
        });
      }
    };

    socket.on('order_status_updated', handleStatusUpdated);
    socket.on('order_completed', handleCompleted);
    socket.on('new_order', handleNewOrder);

    return () => {
      socket.off('order_status_updated', handleStatusUpdated);
      socket.off('order_completed', handleCompleted);
      socket.off('new_order', handleNewOrder);
    };
  }, [socket, user, isAdmin]);

  const clearLiveAlert = () => setLiveAlert(null);

  return (
    <SocketContext.Provider value={{ socket, liveAlert, clearLiveAlert }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};

