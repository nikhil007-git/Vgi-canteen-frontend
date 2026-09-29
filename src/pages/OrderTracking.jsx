import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Phone, MessageCircle, ArrowLeft, CheckCircle2, Star, AlertCircle, RefreshCw } from 'lucide-react';
import { vgiApi } from '../services/api';
import { OrderTimeline } from '../components/OrderTimeline';
import { QRDisplay } from '../components/QRDisplay';
import { RatingModal } from '../components/RatingModal';
import { OrderTrackingSkeleton } from '../components/SkeletonLoader';
import { useSocket } from '../context/SocketContext';

export const OrderTracking = () => {
  const { id } = useParams();
  const { socket } = useSocket();
  const [order, setOrder] = useState(null);
  const [canteenContact, setCanteenContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRatingModal, setShowRatingModal] = useState(false);

  const fetchOrder = async () => {
    try {
      const res = await vgiApi.getOrderById(id);
      if (res.success) {
        setOrder(res.order);
        if (res.canteenContact) setCanteenContact(res.canteenContact);
      }
    } catch (err) {
      setError(err.message || 'Unable to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    if (socket) {
      socket.emit('join_order', id);

      const handleOrderUpdate = (data) => {
        if (data.orderId === id) {
          fetchOrder();
        }
      };

      socket.on('order_status_updated', handleOrderUpdate);
      socket.on('order_completed', handleOrderUpdate);

      return () => {
        socket.off('order_status_updated', handleOrderUpdate);
        socket.off('order_completed', handleOrderUpdate);
      };
    }
  }, [id, socket]);

  if (loading) {
    return <OrderTrackingSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">{error || 'Could not locate this order.'}</p>
        <Link
          to="/orders"
          className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 shadow-md"
        >
          View All My Orders
        </Link>
      </div>
    );
  }

  const isReady = order.status === 'READY';
  const isCompleted = order.status === 'COMPLETED';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12 space-y-6">
      {/* Back link & Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>My Orders</span>
        </Link>

        <button
          onClick={fetchOrder}
          className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          title="Refresh status"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Status Card */}
      <div
        className={`rounded-3xl p-6 border text-white shadow-xl transition-all ${
          isReady
            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 shadow-emerald-500/20 animate-pulse-subtle'
            : order.status === 'CANCELLED'
            ? 'bg-rose-700 shadow-rose-700/20'
            : 'bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 shadow-slate-900/20'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
              VGI Canteen Order Tracking
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-0.5 tracking-tight">
              Order #{order.displayNumber || order.orderNumber}
            </h1>
            <p className="text-xs text-white/80 mt-1">
              Placed on {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
              {order.items.length} {order.items.length === 1 ? 'item' : 'items'} • ₹{order.total}
            </p>
          </div>

          {/* Prominent Status Pill */}
          <div className="self-start sm:self-auto px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-white/80 tracking-wider block">
              Current State
            </span>
            <span className="text-sm font-black tracking-wide">
              {order.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Timeline + Right Pickup QR Pass */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Progress Timeline & Order Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Timeline Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">Preparation Progress</h3>

            <OrderTimeline
              status={order.status}
              prepTimeMinutes={order.prepTimeMinutes}
              estimatedReadyTime={order.estimatedReadyTime}
              readyAt={order.readyAt}
              completedAt={order.completedAt}
              cancelReason={order.cancelReason}
            />
          </div>

          {/* Items Summary Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Ordered Items
            </h4>

            <div className="space-y-2.5">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">
                      {item.quantity}x {item.itemName}
                    </span>
                    {item.options?.length > 0 && (
                      <span className="block text-[11px] text-slate-400">
                        {item.options.map((o) => o.optionName).join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="font-bold text-slate-900">₹{item.subtotal}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between text-xs font-bold text-slate-800">
              <span>Total Paid</span>
              <span className="text-sm text-brand-600 font-extrabold">₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Right Column: QR Pickup Pass & Canteen Help */}
        <div className="lg:col-span-5 space-y-6">
          {/* QR Pickup Pass */}
          <QRDisplay
            orderId={order.id}
            pickupCode={order.pickupCode}
            status={order.status}
          />

          {/* Rate Meal Button (If completed) */}
          {isCompleted && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 text-center space-y-2">
              <div className="w-10 h-10 bg-amber-400 text-white rounded-xl flex items-center justify-center mx-auto">
                <Star className="w-5 h-5 fill-white" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-sm">
                {order.rating ? 'You rated this meal' : 'How was your food?'}
              </h4>
              <p className="text-xs text-slate-600">
                {order.rating
                  ? `You gave ${order.rating.stars} stars: "${order.rating.review || 'No written review'}"`
                  : 'Rate your meal to help the canteen staff maintain great quality.'}
              </p>
              <button
                onClick={() => setShowRatingModal(true)}
                className="mt-1 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
              >
                {order.rating ? 'Update Rating' : 'Leave a Rating'}
              </button>
            </div>
          )}

          {/* Canteen Counter Contact & Help Section (PRD §20) */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">Need Help with this Order?</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              If you need urgent assistance or wish to request cancellation, reach out to the canteen counter directly:
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:${canteenContact?.phone || '+919876543210'}`}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
              >
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Direct Call</span>
              </a>

              <a
                href={`https://wa.me/${(canteenContact?.whatsapp || '+919876543210').replace(/\D/g, '')}?text=${encodeURIComponent(
                  `Hi VGI Canteen, I need help with Order #${order.displayNumber}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      {showRatingModal && (
        <RatingModal
          orderId={order.id}
          existingRating={order.rating}
          onClose={() => setShowRatingModal(false)}
          onRatingSubmitted={() => fetchOrder()}
        />
      )}
    </div>
  );
};

