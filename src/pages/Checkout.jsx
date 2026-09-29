import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, CreditCard, Lock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { vgiApi } from '../services/api';

export const Checkout = () => {
  const { cart, subtotal, discount, finalTotal, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [phone, setPhone] = useState(user?.phone || '');
  const [confirmPhone, setConfirmPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    // Phone validation
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanConfirm = confirmPhone.trim().replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile phone number.');
      return;
    }

    if (cleanPhone !== cleanConfirm) {
      setError('Phone number and Confirm Phone number do not match. Please verify.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create order intent on backend
      const orderPayload = {
        items: cart.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
          selectedOptions: item.selectedOptions ? item.selectedOptions.map((o) => o.id) : [],
          specialInstruction: item.specialInstruction
        })),
        phone: cleanPhone,
        confirmPhone: cleanConfirm,
        couponCode: coupon?.code
      };

      const orderRes = await vgiApi.createOrder(orderPayload);
      if (!orderRes.success) {
        throw new Error(orderRes.message || 'Failed to place order.');
      }

      const { order, payment, razorpayKey } = orderRes;

      // 2. Open Razorpay Checkout or Simulated Sandbox
      if (payment.isMock || !window.Razorpay) {
        // Transparent development simulator verification
        const verifyRes = await vgiApi.verifyPayment({
          orderId: order.id,
          razorpay_order_id: payment.id,
          razorpay_payment_id: `pay_demo_${Date.now()}`,
          razorpay_signature: 'verified_dev_mock_signature'
        });

        if (verifyRes.success) {
          clearCart();
          navigate(`/orders/${order.id}`);
        } else {
          throw new Error('Payment verification failed');
        }
      } else {
        // Live Razorpay SDK Modal
        const options = {
          key: razorpayKey,
          amount: payment.amount,
          currency: payment.currency,
          name: 'VGI Canteen',
          description: `Order #${order.displayNumber}`,
          order_id: payment.id,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: cleanPhone
          },
          theme: {
            color: '#f97316'
          },
          handler: async (response) => {
            try {
              const verifyRes = await vgiApi.verifyPayment({
                orderId: order.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyRes.success) {
                clearCart();
                navigate(`/orders/${order.id}`);
              } else {
                setError('Payment verification failed on server. Please contact canteen.');
              }
            } catch (vErr) {
              setError(vErr.message || 'Payment verification failed');
            }
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setError(err.message || 'An error occurred during order checkout.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Checkout & Payment</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verify pickup phone number and complete secure payment to place your order.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="space-y-6">
        {/* Required Phone Verification Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
            <Phone className="w-5 h-5 text-brand-500" />
            <span>Counter Pickup Contact Details</span>
          </div>
          <p className="text-xs text-slate-500">
            Canteen counter staff uses this phone number if they need to reach you regarding your food.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={12}
                required
                className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Confirm Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="Re-enter same number"
                value={confirmPhone}
                onChange={(e) => setConfirmPhone(e.target.value)}
                maxLength={12}
                required
                className="w-full text-sm font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
            Order Items ({cart.length})
          </h3>

          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-800">
                    {item.quantity}x {item.itemName}
                  </span>
                  {item.selectedOptions?.length > 0 && (
                    <span className="block text-[11px] text-slate-400">
                      {item.selectedOptions.map((o) => o.name).join(', ')}
                    </span>
                  )}
                </div>
                <span className="font-extrabold text-slate-900">
                  ₹{(item.basePrice + (item.selectedOptions?.reduce((a, b) => a + (b.priceDelta || 0), 0) || 0)) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-slate-800">₹{subtotal}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Coupon Discount ({coupon?.code})</span>
                <span>-₹{discount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
              <span>Final Payable Total</span>
              <span className="text-brand-600">₹{finalTotal}</span>
            </div>
          </div>
        </div>

        {/* Razorpay Gateway Badge & Submit */}
        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Razorpay 256-bit Encrypted Payment (UPI, Cards, NetBanking)</span>
            </div>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-base shadow-xl shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01] active:scale-[0.99]"
          >
            {loading ? (
              <span>Processing Payment...</span>
            ) : (
              <>
                <span>Pay ₹{finalTotal} & Place Order</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

