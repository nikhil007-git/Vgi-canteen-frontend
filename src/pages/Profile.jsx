import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, LogOut, Check, ShoppingBag, UtensilsCrossed, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { vgiApi } from '../services/api';

export const Profile = () => {
  const { user, logout, updateUser, isAdmin, isClerkUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Automatically update input fields whenever user object loads or updates
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await vgiApi.updateProfile({ name: name.trim(), phone: phone.trim() });
      if (res.success) {
        updateUser(res.user);
        setSuccessMsg('Your profile details were updated successfully!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(res.message || 'Failed to update details.');
      }
    } catch (err) {
      // Local optimistic update if backend returns error
      updateUser({ name: name.trim(), phone: phone.trim() });
      setSuccessMsg('Profile details saved locally!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-24 md:pb-12 space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account & Profile</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">Manage your campus meal credentials & pickup details</p>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Avatar Picture (Google / Clerk photo if available, else Gradient initial) */}
          {user.imageUrl ? (
            <img
              src={user.imageUrl}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-200 shadow-md flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-amber-500 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
              {user.name?.charAt(0).toUpperCase() || 'S'}
            </div>
          )}

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{user.name || 'Campus Student'}</h2>
            </div>
            <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-0.5">
              <span>{user.email}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline flex-shrink-0" />
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-brand-50 text-brand-700 border border-brand-200">
                {(user?.role === 'ADMIN' || user?.role === 'STAFF') ? '🛡️ Canteen Staff' : '🎓 Campus Student'}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">
                {isClerkUser ? 'Verified via Clerk' : 'Campus Account'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/orders"
          className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand-300 hover:bg-brand-50/30 transition-all shadow-xs flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">My Orders</p>
            <p className="text-[10px] text-slate-400">Order history & status</p>
          </div>
        </Link>

        <Link
          to="/menu"
          className="p-4 rounded-2xl bg-white border border-slate-100 hover:border-brand-300 hover:bg-brand-50/30 transition-all shadow-xs flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">Order Food</p>
            <p className="text-[10px] text-slate-400">Browse hot menu</p>
          </div>
        </Link>
      </div>

      {/* Personal Information Form */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-sm text-slate-900">Personal Information</h3>
          <p className="text-[11px] text-slate-400 mt-0.5">Details saved here are used when preparing your order token</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Campus Email (Read-only)</label>
            <div className="relative">
              <input
                type="email"
                value={user.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 text-sm font-medium cursor-not-allowed"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Pickup Phone Number <span className="text-slate-400 font-normal">(for pickup notification SMS/Call)</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-md shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Sign Out Button */}
      <button
        onClick={logout}
        className="w-full py-3.5 rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out from VGI Canteen</span>
      </button>
    </div>
  );
};
