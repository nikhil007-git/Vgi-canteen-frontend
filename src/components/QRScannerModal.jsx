import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, X, CheckCircle, Search, Camera } from 'lucide-react';
import { vgiApi } from '../services/api';

export const QRScannerModal = ({ onClose, onOrderVerified }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successOrder, setSuccessOrder] = useState(null);
  const [scannerActive, setScannerActive] = useState(false);
  const html5QrCodeRef = useRef(null);

  const startScanner = async () => {
    try {
      setError('');
      setScannerActive(true);
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // Scanned successfully
          try {
            const data = JSON.parse(decodedText);
            if (data.orderId || data.pickupCode) {
              await html5QrCode.stop();
              setScannerActive(false);
              verifyPickup(data.pickupCode, data.orderId);
            }
          } catch {
            // Direct string token scanned
            await html5QrCode.stop();
            setScannerActive(false);
            verifyPickup(decodedText);
          }
        },
        (errorMessage) => {
          // ignore scan frame errors
        }
      );
    } catch (err) {
      setError('Camera access error or permission denied: ' + err.message);
      setScannerActive(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && scannerActive) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (e) {
        console.warn('Error stopping scanner', e);
      }
      setScannerActive(false);
    }
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  const verifyPickup = async (pickupCode, orderId) => {
    setLoading(true);
    setError('');
    try {
      const res = await vgiApi.verifyPickup({ pickupCode, orderId });
      if (res.success) {
        setSuccessOrder(res.order);
        if (onOrderVerified) onOrderVerified(res.order);
      }
    } catch (err) {
      setError(err.message || 'Failed to verify pickup.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    verifyPickup(tokenInput.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl relative">
        <button
          onClick={() => {
            stopScanner();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Counter Pickup Verification</h3>
          <p className="text-xs text-slate-500">Scan student's QR code or enter their pickup token</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        {successOrder ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-extrabold text-emerald-800">Pickup Confirmed!</h4>
              <p className="text-sm font-bold text-slate-900 mt-1">Order #{successOrder.displayNumber || successOrder.orderNumber}</p>
              <p className="text-xs text-slate-500 mt-0.5">Token: {successOrder.pickupCode} • Customer: {successOrder.user?.name}</p>
            </div>
            <button
              onClick={() => {
                setSuccessOrder(null);
                setTokenInput('');
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700"
            >
              Verify Another Order
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Camera QR Scanner Viewport */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 text-center">
              <div
                id="qr-reader"
                className="w-full max-w-xs mx-auto rounded-xl overflow-hidden bg-black/5"
              />

              {!scannerActive ? (
                <button
                  type="button"
                  onClick={startScanner}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  <span>Start Camera QR Scanner</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopScanner}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors"
                >
                  <span>Stop Scanner</span>
                </button>
              )}
            </div>

            {/* Manual Token Entry */}
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Or Enter Pickup Token (e.g. VGI-1234)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. VGI-983"
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                  className="flex-1 text-sm font-mono font-bold tracking-wider px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={loading || !tokenInput.trim()}
                  className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>{loading ? 'Verifying...' : 'Verify'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

