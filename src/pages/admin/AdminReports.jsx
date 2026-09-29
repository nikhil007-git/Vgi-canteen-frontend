import React, { useState, useEffect } from 'react';
import { BarChart3, IndianRupee, ShoppingBag, Clock, Star, TrendingUp, RefreshCw } from 'lucide-react';
import { vgiApi } from '../../services/api';

export const AdminReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const res = await vgiApi.getAnalytics();
      if (res.success) setReport(res.report);
    } catch (err) {
      console.warn('Failed to load analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Sales & Analytics Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Campus performance, popular items, and student feedback
          </p>
        </div>

        <button
          onClick={fetchReport}
          className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading || !report ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 rounded-2xl skeleton-shimmer" />
          ))}
        </div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400">Total Verified Sales</span>
              <p className="text-3xl font-black text-slate-900 mt-1">₹{report.totalRevenue}</p>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Completed Orders</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400">Total Orders Placed</span>
              <p className="text-3xl font-black text-slate-900 mt-1">{report.totalOrdersCount}</p>
              <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                {report.completedOrdersCount} fulfilled • {report.cancelledOrdersCount} cancelled
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400">Avg. Preparation Time</span>
              <p className="text-3xl font-black text-amber-600 mt-1">~{report.avgPrepTimeMinutes}m</p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Order to Ready at Counter</span>
            </div>

            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
              <span className="text-xs font-bold text-slate-400">Student Satisfaction</span>
              <p className="text-3xl font-black text-emerald-600 mt-1 flex items-center gap-1">
                <span>{report.avgRating}</span>
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              </p>
              <span className="text-[10px] text-slate-400 font-medium mt-1 block">Based on post-pickup ratings</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Top Selling Items */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                Top Selling Canteen Dishes
              </h3>

              {report.popularItems?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No sales data yet.</p>
              ) : (
                <div className="space-y-3">
                  {report.popularItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-extrabold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.name}</span>
                          <span className="text-[11px] text-slate-500">{item.soldCount} portions sold</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900">₹{item.revenue}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Student Feedback & Ratings */}
            <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
                Recent Student Reviews
              </h3>

              {report.recentReviews?.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No reviews recorded yet.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {report.recentReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{rev.user?.name || 'Student'}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: rev.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>
                      {rev.review && (
                        <p className="text-xs text-slate-600 italic">"{rev.review}"</p>
                      )}
                      <span className="text-[10px] text-slate-400 block">
                        Order #{rev.order?.displayNumber || ''} • {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

