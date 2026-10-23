import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isDismissed, setIsDismissed] = useState(() => sessionStorage.getItem('pwa_prompt_dismissed') === 'true');

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!deferredPrompt || isDismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-40 bg-slate-900 text-white rounded-3xl p-4 shadow-2xl border border-slate-700/60 backdrop-blur-md animate-in slide-in-from-bottom-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            🍽️
          </div>
          <div>
            <h4 className="font-extrabold text-xs sm:text-sm text-white">
              Install VGI Canteen App
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
              Add to Home Screen for fast ordering and live token alerts.
            </p>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-slate-800">
        <button
          onClick={handleDismiss}
          className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold transition-colors"
        >
          Later
        </button>
        <button
          onClick={handleInstallClick}
          className="px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-500/20 transition-all"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install Now</span>
        </button>
      </div>
    </div>
  );
};

