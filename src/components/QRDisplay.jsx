import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, ShieldCheck } from 'lucide-react';

export const QRDisplay = ({ orderId, pickupCode, status }) => {
  // QR Payload: JSON with order verification details
  const qrValue = JSON.stringify({
    type: 'VGI_CANTEEN_PICKUP',
    orderId,
    pickupCode
  });

  const isReady = status === 'READY';
  const isCompleted = status === 'COMPLETED';

  return (
    <div className={`p-6 rounded-3xl border text-center transition-all ${
      isReady
        ? 'bg-gradient-to-b from-emerald-50 to-white border-emerald-200 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/20'
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-center gap-2 mb-3">
        <QrCode className={`w-5 h-5 ${isReady ? 'text-emerald-600' : 'text-slate-500'}`} />
        <h3 className="font-extrabold text-sm sm:text-base text-slate-900 uppercase tracking-wide">
          Counter Pickup Pass
        </h3>
      </div>

      {/* QR Code Container */}
      <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-sm mb-4">
        <QRCodeSVG
          value={qrValue}
          size={180}
          level="H"
          includeMargin={false}
          className="mx-auto"
        />
      </div>

      {/* Backup Pickup Token */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-3 max-w-xs mx-auto">
        <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
          Backup Pickup Token
        </span>
        <span className="text-2xl sm:text-3xl font-black text-brand-600 tracking-widest font-mono">
          {pickupCode}
        </span>
      </div>

      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
        {isReady ? (
          <span className="font-semibold text-emerald-700">
            Show this QR or tell your token to the counter staff to collect your food immediately!
          </span>
        ) : isCompleted ? (
          <span className="text-slate-400">This order has already been verified and collected.</span>
        ) : (
          <span>Your pickup pass is active. You can show this once food is ready.</span>
        )}
      </p>
    </div>
  );
};

