import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Image as ImageIcon, Flame, Sparkles, RefreshCw, Upload, Cloud, Loader2, Search, CheckCircle2, XCircle } from "lucide-react";
import { vgiApi } from "../../services/api";

export const AdminMenu = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [imageUploadMode, setImageUploadMode] = useState("upload"); // "upload" | "url"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [stockFilter, setStockFilter] = useState("ALL"); // "ALL" | "IN_STOCK" | "OUT_OF_STOCK"

  // Form State
  const initialForm = {
    name: "",
    categoryId: "",
    price: "",
    description: "",
    imageUrl: "",
    prepTime: 15,
    isPopular: false,
    isFeatured: false,
    soldOut: false,
    stockMode: "MANUAL",
    stockQty: 100
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsRes, catsRes] = await Promise.all([
        vgiApi.getItems(),
        vgiApi.getCategories()
      ]);
      if (itemsRes.success) setItems(itemsRes.items);
      if (catsRes.success) setCategories(catsRes.categories);
    } catch (err) {
      console.warn("Failed to load menu items", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select a valid image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size exceeds 5MB limit.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadError("");
      const res = await vgiApi.uploadImage(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, imageUrl: res.url }));
      } else {
        throw new Error(res.message || "Upload failed");
      }
    } catch (err) {
      // Direct instant fallback using FileReader
      try {
        const reader = new FileReader();
        reader.onload = (loadEvt) => {
          setFormData((prev) => ({ ...prev, imageUrl: loadEvt.target.result }));
          setUploadError("");
        };
        reader.readAsDataURL(file);
      } catch {
        setUploadError(err.message || "Failed to process image");
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      ...initialForm,
      categoryId: categories[0]?.id || ""
    });
    setUploadError("");
    setUploadingImage(false);
    setModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      categoryId: item.categoryId,
      price: item.price,
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      prepTime: item.prepTime || 15,
      isPopular: item.isPopular,
      isFeatured: item.isFeatured,
      soldOut: !!item.soldOut,
      stockMode: item.stockMode || "MANUAL",
      stockQty: item.stockQty || 100
    });
    setUploadError("");
    setUploadingImage(false);
    setModalOpen(true);
  };

  const handleToggleSoldOut = async (id) => {
    try {
      const res = await vgiApi.toggleSoldOut(id);
      if (res.success) {
        setItems((prev) =>
          prev.map((it) => (it.id === id ? { ...it, soldOut: res.item.soldOut } : it))
        );
      }
    } catch (err) {
      alert(err.message || "Failed to toggle stock status");
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this menu item?")) return;
    try {
      const res = await vgiApi.deleteMenuItem(id);
      if (res.success) {
        setItems((prev) => prev.filter((it) => it.id !== id));
      }
    } catch (err) {
      alert(err.message || "Failed to delete item");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const targetCategoryId = formData.categoryId || categories[0]?.id;
    if (!targetCategoryId) {
      alert("Please ensure at least one category exists before adding food.");
      return;
    }

    const payload = {
      ...formData,
      categoryId: targetCategoryId
    };

    try {
      if (editingItem) {
        const res = await vgiApi.updateMenuItem(editingItem.id, payload);
        if (res.success) {
          const updated = res.item || { ...editingItem, ...payload };
          setItems((prev) => prev.map((it) => (it.id === editingItem.id ? updated : it)));
          setModalOpen(false);
          fetchData();
        }
      } else {
        const res = await vgiApi.createMenuItem(payload);
        if (res.success) {
          if (res.item) {
            setItems((prev) => [res.item, ...prev]);
          }
          // Reset view filters so the newly created item is immediately visible
          setSelectedCategory("ALL");
          setSearchQuery("");
          setStockFilter("ALL");
          setModalOpen(false);
          fetchData();
        }
      }
    } catch (err) {
      alert(err.message || "Failed to save menu item");
    }
  };

  // Filtered items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "ALL" || item.categoryId === selectedCategory;
    const matchesStock =
      stockFilter === "ALL" ||
      (stockFilter === "IN_STOCK" && !item.soldOut) ||
      (stockFilter === "OUT_OF_STOCK" && item.soldOut);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const inStockCount = items.filter((i) => !i.soldOut).length;
  const outOfStockCount = items.filter((i) => i.soldOut).length;

  return (
    <div className="space-y-6 pb-20 md:pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Menu & Food Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Add food photos, manage prices, and change live In Stock / Out of Stock status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchData}
            className="p-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs"
            title="Refresh menu items"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Item</span>
          </button>
        </div>
      </div>

      {/* Stock Summary & Filter Bar */}
      <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by food name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Quick Stock Filters */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-100 text-xs font-bold">
              <button
                type="button"
                onClick={() => setStockFilter("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  stockFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500"
                }`}
              >
                All ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("IN_STOCK")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  stockFilter === "IN_STOCK" ? "bg-emerald-500 text-white shadow-2xs" : "text-emerald-700"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                <span>In Stock ({inStockCount})</span>
              </button>
              <button
                type="button"
                onClick={() => setStockFilter("OUT_OF_STOCK")}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                  stockFilter === "OUT_OF_STOCK" ? "bg-rose-500 text-white shadow-2xs" : "text-rose-700"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-rose-300" />
                <span>Sold Out ({outOfStockCount})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase border-b border-slate-100">
              <tr>
                <th className="py-3 px-4">Dish & Photo</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Prep Time</th>
                <th className="py-3 px-4">Stock Status (Click to Toggle)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Dish & Photo */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200"}
                        alt={item.name}
                        className="w-11 h-11 rounded-xl object-cover bg-slate-100 border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{item.name}</span>
                        <div className="flex gap-1 mt-0.5">
                          {item.isPopular && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 border border-amber-200">
                              Popular
                            </span>
                          )}
                          {item.isFeatured && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-brand-50 text-brand-700 border border-brand-200">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 text-slate-600 font-semibold">
                    {item.category?.name || "Uncategorized"}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-black text-slate-900 text-sm">
                    ₹{item.price}
                  </td>

                  {/* Prep Time */}
                  <td className="py-3 px-4 text-slate-500 font-semibold">
                    ~{item.prepTime || 15}m
                  </td>

                  {/* Stock Status Interactive Toggle */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggleSoldOut(item.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-2xs border ${
                        item.soldOut
                          ? "bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                      }`}
                      title="Click to switch In Stock / Out of Stock"
                    >
                      <span className={`w-2 h-2 rounded-full ${item.soldOut ? "bg-rose-500" : "bg-emerald-500 animate-pulse"}`} />
                      <span>{item.soldOut ? "Out of Stock" : "In Stock"}</span>
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                        title="Edit Item & Photo"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        title="Delete Item"
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
      </div>

      {/* Add / Edit Item Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                {editingItem ? "Edit Menu Item & Photo" : "Add New Menu Item"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Item Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Item Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Masala Dosa"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-semibold text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price & Prep Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 80"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-semibold text-sm"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Est. Prep Time (mins)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.prepTime}
                    onChange={(e) => setFormData({ ...formData, prepTime: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 font-semibold text-sm"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ingredients, crispiness, accompaniments..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Stock Status Selector (IN STOCK / OUT OF STOCK) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <label className="block font-bold text-slate-800 text-xs">
                  Stock Availability *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, soldOut: false })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      !formData.soldOut
                        ? "bg-emerald-500 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${!formData.soldOut ? "bg-white animate-pulse" : "bg-emerald-500"}`} />
                    <span>In Stock (Available)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, soldOut: true })}
                    className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                      formData.soldOut
                        ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${formData.soldOut ? "bg-white" : "bg-rose-500"}`} />
                    <span>Out of Stock (Sold Out)</span>
                  </button>
                </div>
              </div>

              {/* Food Photo: Upload to Cloudinary or Enter URL */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-slate-700 text-xs">Food Photo (Cloudinary)</label>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("upload")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        imageUploadMode === "upload" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500"
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageUploadMode("url")}
                      className={`px-2 py-0.5 rounded-md transition-all ${
                        imageUploadMode === "url" ? "bg-white text-slate-800 shadow-2xs font-bold" : "text-slate-500"
                      }`}
                    >
                      Enter URL
                    </button>
                  </div>
                </div>

                {imageUploadMode === "upload" ? (
                  <div className="space-y-2">
                    <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-brand-500 hover:bg-brand-50/20 transition-all group">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                        disabled={uploadingImage}
                      />
                      {uploadingImage ? (
                        <div className="flex flex-col items-center gap-2 py-2">
                          <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                          <span className="text-xs font-bold text-slate-600">Uploading to Cloudinary...</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-1 py-1 text-center">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 text-brand-600 flex items-center justify-center group-hover:scale-105 transition-transform mb-1">
                            <Cloud className="w-5 h-5" />
                          </div>
                          <p className="text-xs font-bold text-slate-700">
                            Click to select & upload food photo to Cloudinary
                          </p>
                          <p className="text-[10px] text-slate-400">PNG, JPG, WebP up to 5MB</p>
                        </div>
                      )}
                    </label>
                    {uploadError && (
                      <p className="text-xs text-rose-500 font-semibold">{uploadError}</p>
                    )}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://res.cloudinary.com/... or https://..."
                      className="flex-1 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                )}

                {/* Live Preview Thumbnail */}
                {formData.imageUrl && (
                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover bg-white border border-slate-200 flex-shrink-0"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100";
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          {formData.imageUrl.includes("cloudinary") && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                              <Cloud className="w-3 h-3" /> Cloudinary
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-700 truncate">Image attached</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{formData.imageUrl}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Highlights switches */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPopular}
                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                    className="w-4 h-4 text-brand-500 rounded"
                  />
                  <span className="font-bold text-slate-800">Mark as Popular</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-brand-500 rounded"
                  />
                  <span className="font-bold text-slate-800">Chef&apos;s Special (Featured)</span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/3 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs shadow-md shadow-brand-500/20"
                >
                  {editingItem ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
