import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, ShoppingBag, Clock, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const BottomNav = () => {
  const { itemCount, openCart, isCartOpen } = useCart();

  const navItemClass = ({ isActive }) =>
    `flex flex-col items-center justify-center py-2 px-3 text-xs font-semibold transition-colors relative ${
      isActive ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
    }`;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1 shadow-lg flex items-center justify-around">
      <NavLink to="/home" className={navItemClass}>
        <Home className="w-5 h-5 mb-1" />
        <span>Home</span>
      </NavLink>

      <NavLink to="/menu" className={navItemClass}>
        <Utensils className="w-5 h-5 mb-1" />
        <span>Menu</span>
      </NavLink>

      <button
        type="button"
        onClick={openCart}
        className={`flex flex-col items-center justify-center py-2 px-3 text-xs font-semibold transition-colors relative ${
          isCartOpen ? 'text-brand-600 font-bold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 mb-1" />
          {itemCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 w-4 h-4 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
              {itemCount}
            </span>
          )}
        </div>
        <span>Cart</span>
      </button>

      <NavLink to="/orders" className={navItemClass}>
        <Clock className="w-5 h-5 mb-1" />
        <span>Orders</span>
      </NavLink>

      <NavLink to="/profile" className={navItemClass}>
        <User className="w-5 h-5 mb-1" />
        <span>Profile</span>
      </NavLink>
    </div>
  );
};

