import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { playReadyChime, playNewOrderKitchenAlert } from '../utils/audioAlert';

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

const SocketContext = createContext(null);

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

    const isAdminUser = Boolean(
      isAdmin ||
      user?.role === 'ADMIN' ||
      user?.role === 'STAFF' ||
      localStorage.getItem('vgi_admin_token') ||
      window.location.pathname.startsWith('/admin')
    );

    if (isAdminUser) {
      socket.emit('join_admin');
    }

    // High priority Ready notification listener for customer
    const handleStatusUpdated = (data) => {
      if (data.status === 'READY' || data.isHighPriority) {
        playReadyChime();
        if ('vibrate' in navigator) navigator.vibrate([300, 150, 300]);
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('🎉 Your Order is Ready! 🔔', {
              body: data.message || `Order #${data.displayNumber || ''} is ready at the canteen counter. Show code ${data.pickupCode || ''}`,
              icon: '/icon.svg'
            });
          } catch (e) {}
        }
        setLiveAlert({
          type: 'READY',
          title: data.title || 'Your Order is Ready! 🔔',
          message: data.message || 'Please collect your food at the canteen counter.',
          orderId: data.orderId,
          timestamp: Date.now()
        });
      } else if (data.status === 'COMPLETED') {
        playReadyChime();
        if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('✅ Order Picked Up & Completed!', {
              body: data.message || 'Thank you for dining at VGI Canteen. Enjoy your meal!',
              icon: '/icon.svg'
            });
          } catch (e) {}
        }
        setLiveAlert({
          type: 'COMPLETED',
          title: data.title || '✅ Order Completed!',
          message: data.message || 'Your order has been picked up! Enjoy your meal.',
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

    // Completed listener for customer
    const handleCompleted = (data) => {
      playReadyChime();
      if ('vibrate' in navigator) navigator.vibrate([200, 100, 200]);
      if ('Notification' in window && Notification.permission === 'granted') {
        try {
          new Notification('✅ Order Picked Up & Completed!', {
            body: data.message || 'Thank you for dining at VGI Canteen. Enjoy your meal!',
            icon: '/icon.svg'
          });
        } catch (e) {}
      }
      setLiveAlert({
        type: 'COMPLETED',
        title: data.title || '✅ Order Completed!',
        message: data.message || 'Your order has been picked up! Enjoy your meal.',
        orderId: data.orderId,
        timestamp: Date.now()
      });
    };

    // Admin incoming new order listener
    const handleNewOrder = (data) => {
      if (isAdminUser) {
        playNewOrderKitchenAlert();
        if ('vibrate' in navigator) navigator.vibrate([400, 200, 400]);
        if ('Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification('🔔 New Order Placed!', {
              body: data.message || `Order #${data.order?.displayNumber || data.order?.orderNumber || ''} is waiting for preparation.`,
              icon: '/icon.svg'
            });
          } catch (e) {}
        }
        setLiveAlert({
          type: 'NEW_ORDER',
          title: data.title || '🔔 New Order Placed!',
          message: data.message || `Order #${data.order?.displayNumber || data.order?.orderNumber || ''} is waiting for preparation.`,
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

