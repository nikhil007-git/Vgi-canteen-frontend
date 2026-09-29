import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, ShoppingBag, User, LogOut, ChevronDown, Menu as MenuIcon, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Brand Logo */}
        <Link to={user ? "/home" : "/"} className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
            <UtensilsCrossed className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight whitespace-nowrap">
                VGI Canteen
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-100">
                Campus
              </span>
            </div>
            <p className="text-[10px] text-slate-500 -mt-0.5 hidden md:block">Vishveshwarya Group of Institutions</p>
          </div>
        </Link>

        {/* If on Auth Pages (/login or /register): Show both Log In and Sign Up options */}
        {isAuthPage ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Link
              to="/login"
              className={"px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap " + (
                location.pathname === "/login"
                  ? "bg-brand-50 text-brand-600 border border-brand-200 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className={"px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap " + (
                location.pathname === "/register"
                  ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              )}
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              <Link
                to="/home"
                className={"px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors " + (
                  isActive("/home") ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                Home
              </Link>
              <Link
                to="/menu"
                className={"px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors " + (
                  isActive("/menu") ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                Menu
              </Link>
              {user && (
                <Link
                  to="/orders"
                  className={"px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors " + (
                    isActive("/orders") ? "bg-brand-50 text-brand-600" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  My Orders
                </Link>
              )}
            </nav>

            {/* Action Controls */}
            <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
              {/* Cart Icon */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2 sm:p-2.5 rounded-xl text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                title="View Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 sm:w-5 sm:h-5 bg-brand-500 text-white rounded-full text-[10px] sm:text-[11px] font-bold flex items-center justify-center ring-2 ring-white animate-scale">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* User Profile / Auth */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1 sm:px-3 sm:py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg overflow-hidden bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {user.imageUrl ? (
                        <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0).toUpperCase() || "U"
                      )}
                    </div>
                    <span className="text-xs font-semibold hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:inline" />
                  </button>

                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-brand-50 text-brand-600 border border-brand-100">
                          {user.role || "Student"}
                        </span>
                      </div>

                      <Link
                        to="/orders"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-500" />
                        <span>My Order History</span>
                      </Link>

                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 font-medium"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-1">
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 font-medium text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Always show both Log In and Sign Up options */
                <div className="flex items-center gap-1 sm:gap-2">
                  <Link
                    to="/login"
                    className="px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors whitespace-nowrap"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-brand-500 text-white shadow-md shadow-brand-500/20 hover:bg-brand-600 transition-all whitespace-nowrap"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {!isAuthPage && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 animate-in fade-in slide-in-from-top-2">
          {user ? (
            <div className="p-3 mb-2 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                {user.imageUrl ? (
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase() || "U"
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          ) : (
            <div className="p-3 mb-2 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-brand-900">Student Canteen Portal</p>
                <p className="text-[11px] text-brand-700">Order faster & skip the lines</p>
              </div>
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-brand-500 text-white shadow-xs"
              >
                Sign In
              </Link>
            </div>
          )}

          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className={"block px-3 py-2 rounded-xl text-sm font-semibold " + (
              isActive("/home") ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            Home
          </Link>
          <Link
            to="/menu"
            onClick={() => setMobileMenuOpen(false)}
            className={"block px-3 py-2 rounded-xl text-sm font-semibold " + (
              isActive("/menu") ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
            )}
          >
            Menu & Categories
          </Link>

          {user && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                className={"block px-3 py-2 rounded-xl text-sm font-semibold " + (
                  isActive("/orders") ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                Order Tracking & History
              </Link>
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={"block px-3 py-2 rounded-xl text-sm font-semibold " + (
                  isActive("/profile") ? "bg-brand-50 text-brand-600" : "text-slate-700 hover:bg-slate-50"
                )}
              >
                My Profile & Settings
              </Link>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </>
          )}

          {!user && (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 px-3 rounded-xl text-sm font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
