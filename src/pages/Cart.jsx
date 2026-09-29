import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal, finalTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-brand-50 text-brand-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Your Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
          Explore delicious snacks, beverages, and hot meals from VGI Canteen and add them here!
        </p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
        >
          <span>Browse Canteen Menu</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 pb-28 md:pb-12 space-y-5 sm:space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight">Order Cart</h1>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {cart.length} {cart.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
        {/* Cart Items List - Name and Quantity Only */}
        <div className="lg:col-span-7 space-y-3">
          {cart.map((item, index) => {
            const optionsDelta = (item.selectedOptions || []).reduce(
              (acc, opt) => acc + (opt.priceDelta || 0),
              0
            );
            const unitPrice = (item.basePrice || 0) + optionsDelta;
            const itemTotal = unitPrice * item.quantity;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-xs flex items-center justify-between gap-3 hover:border-slate-200 transition-colors"
              >
                {/* Food Details - Name and selected options only */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                        item.isVeg ? "bg-emerald-500" : "bg-rose-500"
                      }`}
                      title={item.isVeg ? "Vegetarian" : "Non-Veg"}
                    />
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                      {item.itemName}
                    </h3>
                  </div>

                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.selectedOptions.map((o) => o.name).join(", ")}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-slate-600">
                      ₹{unitPrice}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      × {item.quantity}
                    </span>
                  </div>
                </div>

                {/* Quantity Control Stepper & Price */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-xs transition-colors"
                      title="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Item Total Price */}
                  <span className="font-extrabold text-sm sm:text-base text-slate-900 min-w-[48px] text-right">
                    ₹{itemTotal}
                  </span>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs space-y-3">
            <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-2.5">
              Bill Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-800">₹{subtotal}</span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Campus Canteen Charges</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-xs text-slate-500 block">Total Amount</span>
                <span className="text-lg sm:text-xl font-black text-slate-900">₹{finalTotal}</span>
              </div>

              <button
                onClick={handleProceedToCheckout}
                className="py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lg shadow-brand-500/25 transition-all flex items-center gap-2 hover:scale-[1.02] active:scale-[0.99] flex-shrink-0"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
