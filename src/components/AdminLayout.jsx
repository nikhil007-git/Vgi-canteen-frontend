import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Utensils,
  Tag,
  Settings,
  BarChart3,
  QrCode,
  ArrowLeft,
  ShieldAlert,
  Menu,
  X
} from 'lucide-react';
import { QRScannerModal } from './QRScannerModal';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const basePath = location.pathname.startsWith('/admin-secure-panel') ? '/admin-secure-panel' : '/admin';
  const [showScanner, setShowScanner] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-slate-200 text-center">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Access Required</h2>
          <p className="text-xs text-slate-500 mt-2 mb-6">
            You do not have staff or administrator privileges to view this section.
          </p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate(`${basePath === '/admin-secure-panel' ? '/admin-secure-panel/login' : '/admin/login'}`)}
              className="w-full py-3 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md hover:bg-brand-600 transition-colors"
            >
              Sign In as Staff / Kitchen Admin
            </button>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Return to Student View
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navLinks = [
    { to: `${basePath}`, end: true, label: 'Live Dashboard', icon: LayoutDashboard },
    { to: `${basePath}/orders`, label: 'Order Queue', icon: ClipboardList },
    { to: `${basePath}/menu`, label: 'Menu & Stock', icon: Utensils },
    { to: `${basePath}/coupons`, label: 'Coupons & Promos', icon: Tag },
    { to: `${basePath}/settings`, label: 'Canteen Control', icon: Settings },
    { to: `${basePath}/reports`, label: 'Sales & Reports', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white text-slate-800 border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-2">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-600 hover:text-slate-900">
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-extrabold text-sm tracking-tight text-slate-900">VGI Canteen Staff</span>
        </div>
        <button
          onClick={() => setShowScanner(true)}
          className="px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
        >
          <QrCode className="w-4 h-4" />
          <span>Verify Pickup</span>
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-700 border-r border-slate-200/80 shadow-xs flex flex-col justify-between transition-transform duration-300 md:translate-x-0 md:static ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-base tracking-tight">VGI Operations</span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200/70">
                  Staff
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Counter Control Panel</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Counter Action: Scan QR */}
          <div className="p-4">
            <button
              onClick={() => {
                setSidebarOpen(false);
                setShowScanner(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-brand-500/20 transition-all hover:scale-[1.01]"
            >
              <QrCode className="w-4 h-4" />
              <span>Verify Counter Pickup</span>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="px-3 space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200/80 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom user badge & exit */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60">
          <div className="mb-3 px-2">
            <p className="text-xs font-semibold text-slate-800 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
          </div>
          <Link
            to="/home"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white border border-slate-200/80 hover:bg-slate-100 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Exit to Student App</span>
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto bg-slate-50">
        <Outlet />
      </main>

      {/* Verification Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onOrderVerified={() => {
            // Can trigger refresh if needed
          }}
        />
      )}
    </div>
  );
};

