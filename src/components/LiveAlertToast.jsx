import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const LiveAlertToast = () => {
  const { liveAlert, clearLiveAlert } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (liveAlert) {
      const timer = setTimeout(() => {
        clearLiveAlert();
      }, 9000);
      return () => clearTimeout(timer);
    }
  }, [liveAlert, clearLiveAlert]);

  if (!liveAlert) return null;

  const isReady = liveAlert.type === 'READY';

  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
      <div
        className={`p-4 rounded-2xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${
          isReady
            ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-500/30'
            : 'bg-slate-900 text-white border-slate-800 shadow-slate-900/30'
        }`}
      >
        <div
          className={`p-2 rounded-xl flex-shrink-0 ${
            isReady ? 'bg-white/20 text-white' : 'bg-brand-500 text-white'
          }`}
        >
          {isReady ? <CheckCircle2 className="w-6 h-6 animate-bounce" /> : <Bell className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-sm leading-snug">{liveAlert.title}</h4>
          <p className="text-xs opacity-90 mt-1 leading-relaxed">{liveAlert.message}</p>

          {liveAlert.orderId && (
            <button
              onClick={() => {
                clearLiveAlert();
                navigate(liveAlert.type === 'NEW_ORDER' ? '/admin/orders' : `/orders/${liveAlert.orderId}`);
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
            >
              <span>View Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={clearLiveAlert}
          className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

