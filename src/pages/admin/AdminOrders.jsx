import React, { useState, useEffect } from 'react';
import {
  Clock,
  CheckCircle2,
  ChefHat,
  Bell,
  CheckCheck,
  XCircle,
  QrCode,
  Search,
  RefreshCw,
  Phone,
  AlertTriangle
} from 'lucide-react';
import { vgiApi } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { QRScannerModal } from '../../components/QRScannerModal';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [prepModalOrder, setPrepModalOrder] = useState(null);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const { socket } = useSocket();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await vgiApi.getAdminOrders({ status: statusFilter, search });
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('Failed to load admin orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    if (socket) {
      socket.on('new_order', () => fetchOrders());
      socket.on('admin_order_updated', () => fetchOrders());

      return () => {
        socket.off('new_order');
        socket.off('admin_order_updated');
      };
    }
  }, [statusFilter, socket]);

  const handleUpdateStatus = async (orderId, newStatus, extraData = {}) => {
    try {
      const res = await vgiApi.updateOrderStatus(orderId, { status: newStatus, ...extraData });
      if (res.success) {
        fetchOrders();
        setPrepModalOrder(null);
        setCancelModalOrder(null);
        setCancelReason('');
      }
    } catch (err) {
      alert(err.message || 'Status update failed.');
    }
  };

  const handleVerifyDirect = async (pickupCode) => {
    try {
      const res = await vgiApi.verifyPickup({ pickupCode });
      if (res.success) {
        fetchOrders();
      }
    } catch (err) {
      alert(err.message || 'Pickup verification failed.');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Title & Quick Scanner CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Counter Order Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage preparation timers, customer pickups, and cancellations
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowScanner(true)}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <QrCode className="w-4 h-4" />
            <span>Scan Customer QR</span>
          </button>

          <button
            onClick={fetchOrders}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 pb-1">
          {['ALL', 'PAID', 'PREPARING', 'READY', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {st === 'PAID' ? 'New Orders' : st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search by order #, phone, code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchOrders()}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Order Cards List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-36 rounded-3xl skeleton-shimmer" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <ChefHat className="w-12 h-12 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-base">No orders in this status</h3>
          <p className="text-xs text-slate-500 mt-1">Incoming paid orders will appear here in real time.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isNew = order.status === 'PAID';
            const isPreparing = order.status === 'PREPARING' || order.status === 'ACCEPTED';
            const isReady = order.status === 'READY';
            const isDone = order.status === 'COMPLETED';
            const isCancelled = order.status === 'CANCELLED';

            return (
              <div
                key={order.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border transition-all ${
                  isNew
                    ? 'border-brand-300 shadow-md shadow-brand-500/10 ring-2 ring-brand-500/20'
                    : isReady
                    ? 'border-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'border-slate-200 shadow-xs'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 text-lg sm:text-xl">
                      #{order.displayNumber || order.orderNumber}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                        isNew
                          ? 'bg-brand-100 text-brand-700 animate-pulse'
                          : isPreparing
                          ? 'bg-amber-100 text-amber-800'
                          : isReady
                          ? 'bg-emerald-100 text-emerald-800 animate-bounce'
                          : isDone
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 font-mono">
                      Token:{' '}
                      <strong className="text-brand-600 font-bold text-sm">{order.pickupCode}</strong>
                    </span>
                    <span className="text-sm font-black text-slate-900">₹{order.total}</span>
                  </div>
                </div>

                {/* Customer & Item details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8 space-y-2">
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">{order.user?.name}</span>
                      <a
                        href={`tel:${order.phone}`}
                        className="flex items-center gap-1 text-brand-600 font-bold hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{order.phone}</span>
                      </a>
                      <span className="text-slate-400">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {/* Ordered items pill list */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.items?.map((item) => (
                        <div
                          key={item.id}
                          className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs"
                        >
                          <span className="font-extrabold text-slate-900">{item.quantity}x</span>{' '}
                          <span className="font-bold text-slate-800">{item.itemName}</span>
                          {item.options?.length > 0 && (
                            <span className="text-[10px] text-slate-500 block">
                              ({item.options.map((o) => o.optionName).join(', ')})
                            </span>
                          )}
                          {item.specialInstruction && (
                            <span className="text-[10px] text-brand-600 italic block">
                              "{item.specialInstruction}"
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="md:col-span-4 flex flex-wrap sm:flex-nowrap items-center justify-end gap-2 pt-2 md:pt-0">
                    {/* State: PAID -> Start Preparing with ETA */}
                    {isNew && (
                      <button
                        onClick={() => setPrepModalOrder(order)}
                        className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <ChefHat className="w-4 h-4" />
                        <span>Accept & Set ETA</span>
                      </button>
                    )}

                    {/* State: PREPARING -> Mark Ready */}
                    {isPreparing && (
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => setPrepModalOrder(order)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                          title="Update ETA"
                        >
                          ETA: ~{order.prepTimeMinutes || 15}m
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'READY')}
                          className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Bell className="w-4 h-4" />
                          <span>Mark Ready</span>
                        </button>
                      </div>
                    )}

                    {/* State: READY -> Confirm Pickup */}
                    {isReady && (
                      <button
                        onClick={() => handleVerifyDirect(order.pickupCode)}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Confirm Pickup</span>
                      </button>
                    )}

                    {/* Cancel button (allowed if not completed) */}
                    {!isDone && !isCancelled && (
                      <button
                        onClick={() => setCancelModalOrder(order)}
                        className="px-3 py-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 font-bold text-xs transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Prep Time ETA Picker Modal */}
      {prepModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-black text-lg text-slate-900">
              Set Preparation Time
            </h3>
            <p className="text-xs text-slate-500">
              Select estimated cooking duration for Order #{prepModalOrder.displayNumber}:
            </p>

            {/* Quick minute buttons */}
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 20, 30, 45].map((mins) => (
                <button
                  key={mins}
                  onClick={() => handleUpdateStatus(prepModalOrder.id, 'PREPARING', { prepTimeMinutes: mins })}
                  className="py-3 px-2 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 font-black text-sm text-slate-800 transition-all hover:scale-105"
                >
                  {mins} mins
                </button>
              ))}
            </div>

            <button
              onClick={() => setPrepModalOrder(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Reason Modal */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-black text-lg text-slate-900">Cancel & Refund Order</h3>
            </div>
            <p className="text-xs text-slate-500">
              Cancelling Order #{cancelModalOrder.displayNumber} will initiate an immediate refund of ₹{cancelModalOrder.total}. Please provide a reason:
            </p>

            <textarea
              rows={3}
              placeholder="e.g. Item out of stock, kitchen equipment delay..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setCancelModalOrder(null)}
                className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
              >
                Back
              </button>
              <button
                disabled={!cancelReason.trim()}
                onClick={() =>
                  handleUpdateStatus(cancelModalOrder.id, 'CANCELLED', { cancelReason: cancelReason.trim() })
                }
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
              >
                Confirm Cancellation & Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onOrderVerified={() => fetchOrders()}
        />
      )}
    </div>
  );
};

