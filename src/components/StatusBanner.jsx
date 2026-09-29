import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { vgiApi } from '../services/api';
import { useSocket } from '../context/SocketContext';

export const StatusBanner = () => {
  const [canteen, setCanteen] = useState(null);
  const { socket } = useSocket();

  const fetchStatus = async () => {
    try {
      const res = await vgiApi.getCanteenStatus();
      if (res.success) {
        setCanteen(res.settings);
      }
    } catch (err) {
      console.warn('Failed to load canteen status', err);
    }
  };

  useEffect(() => {
    fetchStatus();

    if (socket) {
      socket.on('canteen_status_change', () => {
        fetchStatus();
      });
    }

    return () => {
      if (socket) socket.off('canteen_status_change');
    };
  }, [socket]);

  if (!canteen) return null;

  if (canteen.status === 'CLOSED') {
    return (
      <div className="bg-rose-50 border-b border-rose-200 px-4 py-2.5 text-rose-800 text-xs sm:text-sm flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span className="font-semibold">Canteen is Closed.</span>
          <span className="hidden sm:inline text-rose-600">Operating hours: {canteen.openTime} – {canteen.closeTime}. New orders cannot be placed right now.</span>
        </div>
      </div>
    );
  }

  if (canteen.status === 'BUSY' || canteen.isAtCapacity) {
    return (
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2.5 text-amber-900 text-xs sm:text-sm">
        <div className="flex items-center gap-2 max-w-4xl mx-auto">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span className="font-semibold">Canteen is Busy.</span>
          <span className="text-amber-700">Counter is experiencing heavy rush ({canteen.activeOrdersCount} active orders). Preparation might take a bit longer.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-emerald-50 border-b border-emerald-100 px-4 py-2 text-emerald-900 text-xs sm:text-sm">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-semibold text-emerald-800">Canteen is Open</span>
          <span className="hidden md:inline text-emerald-700">| Order before you reach the counter to skip the queue!</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-xs">
          <Clock className="w-3.5 h-3.5" />
          <span>{canteen.openTime} – {canteen.closeTime}</span>
        </div>
      </div>
    </div>
  );
};

