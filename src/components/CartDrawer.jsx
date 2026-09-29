import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  X, 
  ShoppingBag, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Tag, 
  Check, 
  AlertCircle,
  Clock,
  Sparkles
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const CartDrawer = () => {
  const { 
    isCartOpen, 
    closeCart, 
    cart, 
    updateQuantity, 
    removeFromCart, 
    itemCount, 
    subtotal, 
    discount, 
    finalTotal, 
    coupon, 
    couponError, 
    applyCoupon, 
    removeCoupon,
    clearCart
  } = useCart();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background body scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setApplying(true);
    await applyCoupon(couponCode.trim());
    setApplying(false);
  };

  const handleCheckout = () => {
    closeCart();
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base sm:text-lg text-slate-900">Your Cart</h2>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Campus Fresh & Fast Pickup</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-500 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-lg text-slate-900">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-400 max-w-[240px]">
                    Looks like you haven't added anything yet. Explore delicious canteen meals!
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/menu");
                  }}
                  className="mt-2 py-3 px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2"
                >
                  <span>Browse Canteen Menu</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item, index) => {
                  const optionsDelta = (item.selectedOptions || []).reduce(
                    (acc, opt) => acc + (opt.priceDelta || 0),
                    0
                  );
                  const unitPrice = (item.basePrice || item.price || 0) + optionsDelta;
                  const itemTotal = unitPrice * item.quantity;

                  return (
                    <div 
                      key={`${item.id}-${index}`}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex gap-3"
                    >
                      {/* Item Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-slate-200 overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                            <ShoppingBag className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                              {item.name}
                            </h4>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Selected Custom Options */}
                          {item.selectedOptions && item.selectedOptions.length > 0 && (
                            <p className="text-[10px] text-slate-500 mt-0.5 truncate">
                              {item.selectedOptions.map(o => o.name).join(", ")}
                            </p>
                          )}

                          {/* Cooking Instructions */}
                          {item.instructions && (
                            <p className="text-[10px] text-amber-600 italic mt-0.5 truncate">
                              Note: {item.instructions}
                            </p>
                          )}
                        </div>

                        {/* Price & Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-extrabold text-sm text-slate-900">
                            ₹{itemTotal}
                          </span>

                          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-extrabold w-4 text-center text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-6 h-6 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer & Checkout Action (if cart not empty) */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3.5 shadow-lg">
              
              {/* Coupon Code Input */}
              <div className="space-y-1.5">
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <span>{coupon.code} applied (₹{discount} OFF)</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Promo / Coupon code"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 uppercase tracking-wider font-bold"
                    />
                    <button
                      type="submit"
                      disabled={applying || !couponCode.trim()}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-50 transition-colors"
                    >
                      {applying ? "Applying..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900">Total Amount</span>
                  <span className="font-black text-lg text-brand-600">₹{finalTotal}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-xl shadow-brand-500/25 flex items-center justify-center gap-2 transition-all group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  closeCart();
                  navigate("/menu");
                }}
                className="w-full text-center text-xs font-bold text-slate-400 hover:text-slate-600 py-1"
              >
                Continue Browsing Menu
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
