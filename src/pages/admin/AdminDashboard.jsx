import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ChefHat,
  Bell,
  CheckCircle2,
  IndianRupee,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { vgiApi } from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { AdminKPISkeleton } from '../../components/SkeletonLoader';

export const AdminDashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [canteen, setCanteen] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [kpiRes, canteenRes, ordersRes] = await Promise.all([
        vgiApi.getDashboardKPIs(),
        vgiApi.getCanteenStatus(),
        vgiApi.getAdminOrders({ status: 'ALL' })
      ]);

      if (kpiRes.success) setKpis(kpiRes.kpis);
      if (canteenRes.success) setCanteen(canteenRes.settings);
      if (ordersRes.success) setRecentOrders(ordersRes.orders.slice(0, 6));
    } catch (err) {
      console.warn('Failed to load dashboard KPIs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();

    if (socket) {
      socket.on('new_order', () => loadDashboardData());
      socket.on('admin_order_updated', () => loadDashboardData());

      return () => {
        socket.off('new_order');
        socket.off('admin_order_updated');
      };
    }
  }, [socket]);

  const handleCanteenStatusChange = async (newStatus) => {
    try {
      const res = await vgiApi.updateCanteenSettings({ status: newStatus });
      if (res.success) {
        setCanteen((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      alert(err.message || 'Failed to update canteen status');
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Kitchen Operations Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Vishveshwarya Group of Institutions • Real-time counter management
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="self-start sm:self-auto px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live</span>
        </button>
      </div>

      {/* Canteen Status Control Banner (PRD §18) */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
            Campus Ordering Status
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={`w-3 h-3 rounded-full ${
                canteen?.status === 'OPEN'
                  ? 'bg-emerald-500 animate-ping'
                  : canteen?.status === 'BUSY'
                  ? 'bg-amber-500'
                  : 'bg-rose-500'
              }`}
            />
            <h3 className="text-lg font-extrabold text-slate-900">
              Canteen is currently: <span className="capitalize text-brand-600">{canteen?.status?.toLowerCase()}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Max active order limit: <strong>{canteen?.maxActiveOrders || 40}</strong> orders • Current Active: <strong>{kpis?.activeOrders || 0}</strong>
          </p>
        </div>

        {/* Quick status selector buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleCanteenStatusChange('OPEN')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              canteen?.status === 'OPEN'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            OPEN
          </button>
          <button
            onClick={() => handleCanteenStatusChange('BUSY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              canteen?.status === 'BUSY'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 ring-2 ring-amber-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            BUSY
          </button>
          <button
            onClick={() => handleCanteenStatusChange('CLOSED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              canteen?.status === 'CLOSED'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20 ring-2 ring-rose-300'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            CLOSED
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      {loading || !kpis ? (
        <AdminKPISkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">New Paid</span>
              <ShoppingBag className="w-4 h-4 text-brand-500" />
            </div>
            <p className="text-2xl font-black text-brand-600">{kpis.newPaidOrders}</p>
            <span className="text-[10px] text-slate-400">Awaiting acceptance</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">In Kitchen</span>
              <ChefHat className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-amber-600">{kpis.preparingOrders}</p>
            <span className="text-[10px] text-slate-400">Being cooked</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">Ready at Counter</span>
              <Bell className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-600">{kpis.readyOrders}</p>
            <span className="text-[10px] text-slate-400">Waiting for pickup</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">Active Total</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{kpis.activeOrders}</p>
            <span className="text-[10px] text-slate-400">Orders in queue</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">Completed Today</span>
              <CheckCircle2 className="w-4 h-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-purple-600">{kpis.completedToday}</p>
            <span className="text-[10px] text-slate-400">Collected today</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">Today's Sales</span>
              <IndianRupee className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">₹{kpis.todaySales}</p>
            <span className="text-[10px] text-slate-400">Gross verified</span>
          </div>
        </div>
      )}

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Kitchen Orders</h3>
            <p className="text-xs text-slate-500">Live feed of orders arriving at the counter</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Open Full Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No orders currently in the queue.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] font-bold text-slate-400 uppercase bg-slate-50/70 border-y border-slate-100">
                <tr>
                  <th className="py-2.5 px-3">Order</th>
                  <th className="py-2.5 px-3">Student</th>
                  <th className="py-2.5 px-3">Items</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Pickup Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      #{order.displayNumber || order.orderNumber}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {order.user?.name || 'Student'}
                    </td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                      {order.items?.map((i) => `${i.quantity}x ${i.itemName}`).join(', ')}
                    </td>
                    <td className="py-3 px-3 font-extrabold text-slate-900">
                      ₹{order.total}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] uppercase ${
                        order.status === 'READY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'PREPARING'
                          ? 'bg-amber-100 text-amber-800'
                          : order.status === 'PAID'
                          ? 'bg-brand-100 text-brand-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-brand-600">
                      {order.pickupCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

