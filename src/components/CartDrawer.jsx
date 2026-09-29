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
  Sparkles,
  Utensils
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

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when cart is open
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
      {/* Dimmed Classic Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide-in from LEFT panel */}
      <div className="fixed inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-md bg-white border-r border-slate-200/80 shadow-2xl flex flex-col transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
          
          {/* Classic Header */}
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#fafaf9]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-500/10 text-brand-600 flex items-center justify-center border border-brand-500/20">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base text-slate-900 tracking-tight">Your Cart</h2>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-100/80 text-brand-800 border border-brand-200/60">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">VGI Campus Fresh Dining</p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3.5 divide-y divide-slate-100/80">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-100 text-brand-500 flex items-center justify-center shadow-inner">
                  <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-base text-slate-900">Your Cart is Empty</h3>
                  <p className="text-xs text-slate-500 max-w-[220px] mx-auto leading-relaxed">
                    Select your favorite meals, drinks, and snacks from the canteen menu.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate("/menu");
                  }}
                  className="mt-2 py-2.5 px-5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Browse Canteen Menu</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-1">
                {cart.map((item, index) => {
                  const optionsDelta = (item.selectedOptions || []).reduce(
                    (acc, opt) => acc + (opt.priceDelta || 0),
                    0
                  );
                  const unitPrice = (item.basePrice || item.price || 0) + optionsDelta;
                  const itemTotal = unitPrice * item.quantity;

                  const displayName = item.itemName || item.name || item.title || "Delicious Food";
                  const instructions = item.instructions || item.specialInstruction;

                  return (
                    <div 
                      key={`${item.id || item.menuItemId || index}-${index}`}
                      className="pt-3 first:pt-0 flex gap-3.5 items-start group"
                    >
                      {/* Image Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200/80 overflow-hidden flex-shrink-0 relative">
                        {item.imageUrl ? (
                          <img 
                            src={item.imageUrl} 
                            alt={displayName} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                          </div>
                        )}
                      </div>

                      {/* Item Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-snug line-clamp-2">
                            {displayName}
                          </h4>
                          <button
                            onClick={() => removeFromCart(index)}
                            className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Custom Options */}
                        {item.selectedOptions && item.selectedOptions.length > 0 && (
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                            {item.selectedOptions.map(o => o.name).join(", ")}
                          </p>
                        )}

                        {/* Special Note */}
                        {instructions && (
                          <p className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100 inline-block mt-1">
                            Note: {instructions}
                          </p>
                        )}

                        {/* Price & Classic Stepper */}
                        <div className="flex items-center justify-between mt-2.5">
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-black text-sm text-slate-900">
                              ₹{itemTotal}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-[10px] text-slate-400 font-medium">
                                (₹{unitPrice} ea)
                              </span>
                            )}
                          </div>

                          <div className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs overflow-hidden">
                            <button
                              onClick={() => updateQuantity(index, item.quantity - 1)}
                              className="w-6 h-6 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-xs font-bold w-6 text-center text-slate-900 select-none">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(index, item.quantity + 1)}
                              className="w-6 h-6 text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                            >
                              <Plus className="w-2.5 h-2.5" />
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

          {/* Classic Footer Summary */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-slate-200/80 bg-white space-y-3.5 shadow-lg">
              
              {/* Promo code */}
              <div className="space-y-1">
                {coupon ? (
                  <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{coupon.code} (₹{discount} OFF)</span>
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
                      placeholder="Have a Promo code?"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 uppercase tracking-wider font-semibold placeholder:normal-case placeholder:font-normal"
                    />
                    <button
                      type="submit"
                      disabled={applying || !couponCode.trim()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 disabled:opacity-40 transition-colors"
                    >
                      {applying ? "..." : "Apply"}
                    </button>
                  </form>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-500 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Coupon Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-900">Total</span>
                  <span className="font-black text-xl text-brand-600">₹{finalTotal}</span>
                </div>
              </div>

              {/* Classic Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-700 hover:to-brand-600 text-white font-extrabold text-sm shadow-md shadow-brand-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
