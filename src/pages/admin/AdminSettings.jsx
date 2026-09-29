import React, { useState, useEffect } from 'react';
import { Settings, Check, Clock, Phone, MessageCircle, AlertCircle, Save, ShieldCheck, Lock, User, KeyRound } from 'lucide-react';
import { vgiApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminSettings = () => {
  const { user: currentUser, updateUser } = useAuth();

  const [settings, setSettings] = useState({
    status: 'OPEN',
    maxActiveOrders: 40,
    openTime: '08:30 AM',
    closeTime: '08:30 PM',
    contactPhone: '+91 98765 43210',
    contactWhatsapp: '+91 98765 43210',
    announcement: 'Fresh & hot meals ready for pickup at VGI Canteen counter!'
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // Admin credentials state
  const [credForm, setCredForm] = useState({
    username: currentUser?.name || 'admin',
    email: currentUser?.email || 'admin@vgi.ac.in',
    password: '',
    confirmPassword: ''
  });
  const [credSaving, setCredSaving] = useState(false);
  const [credMsg, setCredMsg] = useState('');
  const [credError, setCredError] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await vgiApi.getCanteenStatus();
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.warn('Failed to load settings', err);
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setCredForm((prev) => ({
        ...prev,
        username: currentUser.name || prev.username,
        email: currentUser.email || prev.email
      }));
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg('');

    try {
      const res = await vgiApi.updateCanteenSettings(settings);
      if (res.success) {
        setSavedMsg('Canteen configuration saved successfully!');
        setTimeout(() => setSavedMsg(''), 3500);
      }
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setCredMsg('');
    setCredError('');

    if (credForm.password && credForm.password !== credForm.confirmPassword) {
      setCredError('New passwords do not match. Please re-enter.');
      return;
    }

    if (credForm.password && credForm.password.length < 4) {
      setCredError('Password must be at least 4 characters long.');
      return;
    }

    setCredSaving(true);
    try {
      const res = await vgiApi.updateAdminCredentials({
        username: credForm.username,
        email: credForm.email,
        password: credForm.password || undefined
      });

      if (res.success) {
        setCredMsg(res.message || 'Admin credentials updated successfully!');
        setCredForm((prev) => ({ ...prev, password: '', confirmPassword: '' }));
        if (updateUser && res.user) {
          updateUser(res.user);
        }
        setTimeout(() => setCredMsg(''), 5000);
      }
    } catch (err) {
      setCredError(err.message || 'Failed to update admin credentials.');
    } finally {
      setCredSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-20 md:pb-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Canteen Control & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure operating hours, order capacity limit, announcement, and admin access credentials
        </p>
      </div>

      {/* 1. Admin Login & Security Credentials Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-600 flex items-center justify-center shadow-xs">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">
              Admin Login Credentials
            </h2>
            <p className="text-xs text-slate-500">
              Set the username and password used to unlock this admin panel at <code className="text-brand-600 bg-slate-100 px-1 py-0.5 rounded font-mono">/admin</code>
            </p>
          </div>
        </div>

        {credMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{credMsg}</span>
          </div>
        )}

        {credError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{credError}</span>
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Username */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={credForm.username}
                  onChange={(e) => setCredForm({ ...credForm, username: e.target.value })}
                  placeholder="e.g. admin or canteen_admin"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Can be used directly to log in on the admin page.
              </span>
            </div>

            {/* Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={credForm.email}
                onChange={(e) => setCredForm({ ...credForm, email: e.target.value })}
                placeholder="e.g. admin@vgi.ac.in"
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Alternate login identifier.
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
            {/* New Password */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                New Password (Optional)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={credForm.password}
                  onChange={(e) => setCredForm({ ...credForm, password: e.target.value })}
                  placeholder="Leave blank to keep unchanged"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={credForm.confirmPassword}
                  onChange={(e) => setCredForm({ ...credForm, confirmPassword: e.target.value })}
                  placeholder="Re-type new password"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={credSaving}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{credSaving ? 'Updating Credentials...' : 'Save New Admin Credentials'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Canteen Operational Configuration */}
      {savedMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{savedMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        {/* Operational Status & Max Capacity */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Capacity & Operational Mode
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Ordering State</label>
              <select
                value={settings.status}
                onChange={(e) => setSettings({ ...settings, status: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm focus:ring-2 focus:ring-brand-500"
              >
                <option value="OPEN">OPEN (Orders Allowed)</option>
                <option value="BUSY">BUSY (High Rush Warning)</option>
                <option value="CLOSED">CLOSED (Ordering Disabled)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Max Active Order Capacity</label>
              <input
                type="number"
                min="5"
                max="200"
                value={settings.maxActiveOrders}
                onChange={(e) => setSettings({ ...settings, maxActiveOrders: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                When reached, students see canteen as Busy.
              </span>
            </div>
          </div>
        </div>

        {/* Operating Hours */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Canteen Operating Hours
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Opening Time</label>
              <input
                type="text"
                placeholder="e.g. 08:30 AM"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Closing Time</label>
              <input
                type="text"
                placeholder="e.g. 08:30 PM"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers for Direct Support */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Canteen Counter Help Contacts
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Direct Call Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.contactPhone}
                  onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5">WhatsApp Support Number</label>
              <div className="relative">
                <input
                  type="text"
                  value={settings.contactWhatsapp}
                  onChange={(e) => setSettings({ ...settings, contactWhatsapp: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 font-semibold text-sm focus:ring-2 focus:ring-brand-500"
                />
                <MessageCircle className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Announcement Message */}
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 pb-2 border-b border-slate-100">
            Public Announcement Banner
          </h3>
          <textarea
            rows={2}
            value={settings.announcement || ''}
            onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
            placeholder="Special notice shown on the homepage..."
            className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-extrabold text-xs shadow-lg shadow-brand-500/20 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Settings...' : 'Save Canteen Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

