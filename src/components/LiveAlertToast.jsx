import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, X, ArrowRight, ChefHat, PartyPopper } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const LiveAlertToast = () => {
  const { liveAlert, clearLiveAlert } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    if (liveAlert) {
      const timer = setTimeout(() => {
        clearLiveAlert();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [liveAlert, clearLiveAlert]);

  if (!liveAlert) return null;

  const isReady = liveAlert.type === 'READY';
  const isNewOrder = liveAlert.type === 'NEW_ORDER';
  const isCompleted = liveAlert.type === 'COMPLETED';

  let bannerClass = 'bg-slate-900 text-white border-slate-800 shadow-slate-900/30';
  let iconBg = 'bg-brand-500 text-white';
  let IconComponent = Bell;

  if (isNewOrder) {
    bannerClass = 'bg-gradient-to-r from-orange-600 to-amber-600 text-white border-amber-400/50 shadow-orange-500/40 ring-2 ring-amber-400/30';
    iconBg = 'bg-white/20 text-white';
    IconComponent = ChefHat;
  } else if (isReady) {
    bannerClass = 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-emerald-400/50 shadow-emerald-500/40 ring-2 ring-emerald-400/30';
    iconBg = 'bg-white/20 text-white';
    IconComponent = CheckCircle2;
  } else if (isCompleted) {
    bannerClass = 'bg-gradient-to-r from-teal-700 to-cyan-700 text-white border-teal-400/50 shadow-teal-500/40 ring-2 ring-teal-400/30';
    iconBg = 'bg-white/20 text-white';
    IconComponent = PartyPopper;
  }

  return (
    <div className="fixed top-20 right-4 left-4 sm:left-auto sm:w-96 z-50 animate-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-3xl shadow-2xl border flex items-start gap-3 backdrop-blur-md ${bannerClass}`}>
        <div className={`p-2.5 rounded-2xl flex-shrink-0 ${iconBg}`}>
          <IconComponent className="w-6 h-6 animate-bounce" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-extrabold text-sm leading-snug tracking-tight">{liveAlert.title}</h4>
          <p className="text-xs opacity-95 mt-1 leading-relaxed font-medium">{liveAlert.message}</p>

          {liveAlert.orderId && (
            <button
              onClick={() => {
                clearLiveAlert();
                navigate(isNewOrder ? '/admin/orders' : `/orders/${liveAlert.orderId}`);
              }}
              className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-black px-3.5 py-1.5 rounded-xl bg-white/25 hover:bg-white/35 transition-colors shadow-xs"
            >
              <span>{isNewOrder ? 'Open Kitchen Queue' : isReady ? 'Show Pickup QR' : 'View Order Details'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={clearLiveAlert}
          className="p-1.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


