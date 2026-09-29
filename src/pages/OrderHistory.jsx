import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle2, ChevronRight, RotateCcw, Star, ShoppingBag, UtensilsCrossed } from 'lucide-react';
import { vgiApi } from '../services/api';
import { useCart } from '../context/CartContext';
import { RatingModal } from '../components/RatingModal';

export const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState(null);
  const { addToCart, openCart } = useCart();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await vgiApi.getMyOrders();
      if (res.success) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('Failed to load orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleReorder = (order) => {
    order.items.forEach((item) => {
      addToCart(
        { id: item.menuItemId, name: item.itemName, price: item.unitPrice },
        item.options?.map((o) => ({ id: o.id, name: o.optionName, priceDelta: o.priceDelta })) || [],
        item.quantity,
        item.specialInstruction || ''
      );
    });
    openCart();
  };

  const activeOrders = orders.filter((o) => ['PAID', 'ACCEPTED', 'PREPARING', 'READY'].includes(o.status));
  const pastOrders = orders.filter((o) => ['COMPLETED', 'CANCELLED'].includes(o.status));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">My Orders</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Track active orders and reorder your past favorites in seconds.
        </p>
      </div>

      {/* Active Orders Section */}
      {activeOrders.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-brand-600 font-extrabold text-sm uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span>Active Orders ({activeOrders.length})</span>
          </div>

          <div className="space-y-3">
            {activeOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 border-2 border-brand-200 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-black text-slate-900 text-lg">
                      #{order.displayNumber || order.orderNumber}
                    </span>
                    <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                      order.status === 'READY'
                        ? 'bg-emerald-100 text-emerald-800 animate-bounce'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Pickup Code: <strong className="text-brand-600 font-mono text-sm">{order.pickupCode}</strong> •{' '}
                    {order.items.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                  </p>
                </div>

                <Link
                  to={`/orders/${order.id}`}
                  className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
                >
                  <span>Track Live</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Past Orders Section */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900">Past Orders</h3>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : pastOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 p-6">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No past orders yet</p>
            <p className="text-xs text-slate-400 mt-1">Once you complete a meal, your receipt will show up here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pastOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:border-slate-200 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-50 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        #{order.displayNumber || order.orderNumber}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        order.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()} at{' '}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <span className="font-black text-slate-900 text-base">₹{order.total}</span>
                </div>

                {/* Items description */}
                <p className="text-xs text-slate-600 mb-4">
                  {order.items.map((item) => `${item.quantity}x ${item.itemName}`).join(', ')}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2">
                    {order.status === 'COMPLETED' && (
                      <button
                        onClick={() => setSelectedOrderForRating(order)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
                      >
                        <Star className={`w-3.5 h-3.5 ${order.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
                        <span>{order.rating ? `${order.rating.stars} ★ Rated` : 'Rate Meal'}</span>
                      </button>
                    )}

                    <Link
                      to={`/orders/${order.id}`}
                      className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
                    >
                      Receipt & Details
                    </Link>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-600 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Quick Reorder</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rating Modal */}
      {selectedOrderForRating && (
        <RatingModal
          orderId={selectedOrderForRating.id}
          existingRating={selectedOrderForRating.rating}
          onClose={() => setSelectedOrderForRating(null)}
          onRatingSubmitted={() => fetchOrders()}
        />
      )}
    </div>
  );
};

