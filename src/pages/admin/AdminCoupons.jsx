import React, { useState, useEffect } from "react";
import { Tag, Plus, Trash2, CheckCircle2, X, RefreshCw, Percent, IndianRupee, Sparkles, Edit3 } from "lucide-react";
import { vgiApi } from "../../services/api";

export const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialForm = {
    code: "",
    description: "",
    type: "PERCENTAGE", // "PERCENTAGE" | "FIXED"
    value: 20,
    minOrder: 100,
    maxDiscount: 50,
    usageLimit: 100,
    perUserLimit: 1
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await vgiApi.getAdminCoupons();
      if (res.success) setCoupons(res.coupons);
    } catch (err) {
      console.warn("Failed to load coupons", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenCreate = (preset) => {
    setEditingCoupon(null);
    if (preset) {
      setFormData({
        ...initialForm,
        ...preset
      });
    } else {
      setFormData(initialForm);
    }
    setModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCoupon(c);
    setFormData({
      code: c.code,
      description: c.description || "",
      type: c.type || "PERCENTAGE",
      value: c.value,
      minOrder: c.minOrder || 0,
      maxDiscount: c.maxDiscount || "",
      usageLimit: c.usageLimit || "",
      perUserLimit: c.perUserLimit || 1
    });
    setModalOpen(true);
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await vgiApi.updateCoupon(coupon.id, { active: !coupon.active });
      if (res.success) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === coupon.id ? { ...c, active: !c.active } : c))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to update coupon status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      const res = await vgiApi.deleteCoupon(id);
      if (res.success) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      alert(err.message || "Failed to delete coupon");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCoupon) {
        const res = await vgiApi.updateCoupon(editingCoupon.id, formData);
        if (res.success) {
          fetchCoupons();
          setModalOpen(false);
        }
      } else {
        const res = await vgiApi.createCoupon(formData);
        if (res.success) {
          fetchCoupons();
          setModalOpen(false);
          setFormData(initialForm);
        }
      }
    } catch (err) {
      alert(err.message || "Failed to save coupon");
    }
  };

  // Quick Preset Templates
  const presets = [
    { label: "20% Off Welcome", code: "CAMPUS20", type: "PERCENTAGE", value: 20, minOrder: 100, maxDiscount: 50, description: "20% off up to ₹50 for students" },
    { label: "₹30 Flat Off", code: "FLAT30", type: "FIXED", value: 30, minOrder: 120, maxDiscount: "", description: "Flat ₹30 off on meals over ₹120" },
    { label: "50% Mega Offer", code: "MEGA50", type: "PERCENTAGE", value: 50, minOrder: 150, maxDiscount: 75, description: "50% off up to ₹75" },
    { label: "₹15 Quick Snack", code: "CHAI15", type: "FIXED", value: 15, minOrder: 50, maxDiscount: "", description: "Flat ₹15 off on snacks & chai" }
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Coupons & Discounts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create any percentage or flat discount offer for campus students
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCoupons}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs"
            title="Refresh coupons"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => handleOpenCreate()}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Discount Coupon</span>
          </button>
        </div>
      </div>

      {/* Quick 1-Click Templates */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
          <Sparkles className="w-4 h-4 text-brand-500" />
          <span>Quick 1-Click Discount Templates:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {presets.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleOpenCreate(p)}
              className="p-3 rounded-2xl bg-slate-50 hover:bg-brand-50/60 border border-slate-200/80 hover:border-brand-300 text-left transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-extrabold text-xs text-brand-600 group-hover:text-brand-700">
                  {p.code}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  {p.type === "PERCENTAGE" ? `${p.value}%` : `₹${p.value}`}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1">{p.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Table / Empty State */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        {coupons.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">No Active Discount Coupons</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All previous discount coupons have been cleared. Click &quot;Create Discount Coupon&quot; or choose a quick template above to add a new offer for students.
            </p>
            <button
              onClick={() => handleOpenCreate()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Coupon</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
                <tr>
                  <th className="py-3 px-4">Coupon Code</th>
                  <th className="py-3 px-4">Discount Type</th>
                  <th className="py-3 px-4">Min. Order</th>
                  <th className="py-3 px-4">Max Cap</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-brand-600 text-sm tracking-wide block">
                        {c.code}
                      </span>
                      <span className="text-[10px] text-slate-400">{c.description || "No description"}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 font-extrabold text-xs px-2 py-0.5 rounded-md ${
                        c.type === "PERCENTAGE"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      }`}>
                        {c.type === "PERCENTAGE" ? (
                          <>
                            <Percent className="w-3 h-3" />
                            <span>{c.value}% OFF</span>
                          </>
                        ) : (
                          <>
                            <IndianRupee className="w-3 h-3" />
                            <span>₹{c.value} FLAT OFF</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">₹{c.minOrder}</td>
                    <td className="py-3 px-4 text-slate-600 font-semibold">
                      {c.maxDiscount ? `₹${c.maxDiscount}` : "No limit"}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-700">
                      {c.usedCount} {c.usageLimit && `/ ${c.usageLimit}`}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleActive(c)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors ${
                          c.active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${c.active ? "bg-emerald-600 animate-pulse" : "bg-slate-400"}`} />
                        <span>{c.active ? "Active" : "Disabled"}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          title="Edit Coupon"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                          title="Delete Coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingCoupon ? "Edit Discount Coupon" : "Create Any Discount Coupon"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Coupon Code */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAMPUS25 or FLAT50"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase().replace(/\s+/g, "") })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-sm tracking-wider uppercase focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Offer Description</label>
                <input
                  type="text"
                  placeholder="e.g. 25% off on lunch orders above ₹100"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Discount Type Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Discount Type *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "PERCENTAGE" })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      formData.type === "PERCENTAGE"
                        ? "bg-brand-500 text-white border-brand-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: "FIXED" })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      formData.type === "FIXED"
                        ? "bg-brand-500 text-white border-brand-600 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <IndianRupee className="w-4 h-4" />
                    <span>Flat Amount (₹)</span>
                  </button>
                </div>
              </div>

              {/* Discount Value & Max Cap */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {formData.type === "PERCENTAGE" ? "Discount Percentage (%) *" : "Flat Discount (₹) *"}
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={formData.type === "PERCENTAGE" ? "100" : "10000"}
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {formData.type === "PERCENTAGE" ? "Max Discount Cap (₹)" : "Optional Max Cap"}
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50 (optional)"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Min Order & Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Min. Order Value (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrder}
                    onChange={(e) => setFormData({ ...formData, minOrder: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 200 uses"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 font-semibold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold shadow-md shadow-brand-500/20"
                >
                  {editingCoupon ? "Save Changes" : "Create Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
