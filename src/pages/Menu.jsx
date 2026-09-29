import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, UtensilsCrossed, SlidersHorizontal, X } from "lucide-react";
import { vgiApi } from "../services/api";
import { FoodCard } from "../components/FoodCard";
import { FoodDetailModal } from "../components/FoodDetailModal";
import { FoodCardSkeleton } from "../components/SkeletonLoader";

const getCategoryEmoji = (name = "") => {
  const n = name.toLowerCase();
  if (n.includes("meal") || n.includes("thali") || n.includes("combo")) return "🍱";
  if (n.includes("paratha") || n.includes("roti") || n.includes("bread")) return "🫓";
  if (n.includes("snack") || n.includes("momo") || n.includes("samosa")) return "🥟";
  if (n.includes("noodle") || n.includes("chinese") || n.includes("maggi")) return "🍜";
  if (n.includes("rice") || n.includes("pasta") || n.includes("biryani")) return "🍚";
  if (n.includes("burger") || n.includes("sandwich") || n.includes("roll")) return "🍔";
  if (n.includes("juice") || n.includes("shake") || n.includes("beverage") || n.includes("chai") || n.includes("tea")) return "🧃";
  if (n.includes("sweet") || n.includes("bakery") || n.includes("dessert") || n.includes("cake")) return "🍰";
  return "🍲";
};

export const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialSearch);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false);

  // Load categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await vgiApi.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (e) {
        console.error("Failed to load categories", e);
      }
    };
    fetchCats();
  }, []);

  // Fetch items when category or search changes
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        const params = {};
        if (activeCategory !== "all") params.categoryId = activeCategory;
        if (search.trim()) params.search = search.trim();

        const res = await vgiApi.getItems(params);
        if (res.success) {
          setItems(res.items);
          if (activeCategory === "all" && !search.trim()) {
            setTotalCount(res.items.length);
          }
        }
      } catch (e) {
        console.error("Failed to load items", e);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [activeCategory, search]);

  const handleCategoryClick = (catId) => {
    setActiveCategory(catId);
    setSearchParams((prev) => {
      if (catId === "all") prev.delete("category");
      else prev.set("category", catId);
      return prev;
    });
  };

  const activeCatObj = categories.find((c) => c.id === activeCategory);
  const activeCategoryName = activeCatObj ? activeCatObj.name : "All Items";

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-16 space-y-6">
      {/* Header & Title */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Canteen Menu</h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Freshly prepared meals, snacks, and beverages for Vishveshwarya campus
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search 37+ canteen items..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchParams((prev) => {
                if (!e.target.value) prev.delete("search");
                else prev.set("search", e.target.value);
                return prev;
              });
            }}
            className="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-2xl bg-white border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-2xs placeholder-slate-400"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setSearchParams((prev) => {
                  prev.delete("search");
                  return prev;
                });
              }}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Category Filter Button */}
        <button
          onClick={() => setCategoryDrawerOpen(true)}
          className={"inline-flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-bold border transition-all whitespace-nowrap shadow-2xs " + (
            activeCategory !== "all"
              ? "bg-brand-50 text-brand-600 border-brand-200 ring-2 ring-brand-500/20"
              : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
          )}
        >
          <SlidersHorizontal className="w-4 h-4 text-brand-500" />
          <span className="hidden xs:inline">Categories</span>
          {activeCategory !== "all" ? (
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          ) : (
            <span className="text-slate-400 text-xs font-semibold">({categories.length})</span>
          )}
        </button>
      </div>

      {/* Active Category Filter Badge */}
      {activeCategory !== "all" && (
        <div className="flex items-center gap-2 pt-0.5 animate-in fade-in">
          <span className="text-xs text-slate-500 font-medium">Filtered by:</span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold shadow-2xs">
            <span>{activeCategoryName}</span>
            <button
              onClick={() => handleCategoryClick("all")}
              className="p-0.5 rounded-full hover:bg-brand-100 text-brand-500 transition-colors"
              title="Clear category filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
          <button
            onClick={() => handleCategoryClick("all")}
            className="text-xs text-slate-400 hover:text-slate-700 font-medium underline"
          >
            Show all items
          </button>
        </div>
      )}

      {/* Items Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
            <UtensilsCrossed className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No food items found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearch("");
              handleCategoryClick("all");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-bold hover:bg-brand-100"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => (
            <FoodCard key={item.id} item={item} onSelect={setSelectedItem} />
          ))}
        </div>
      )}

      {/* Floating Browse Menu Button (Swiggy / Zomato style) */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
        <button
          onClick={() => setCategoryDrawerOpen(true)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white text-xs sm:text-sm font-bold shadow-xl shadow-slate-900/25 border border-slate-700/50 backdrop-blur-md transition-all hover:scale-105 active:scale-95 group"
        >
          <UtensilsCrossed className="w-4 h-4 text-brand-400 group-hover:rotate-12 transition-transform" />
          <span>Browse Menu</span>
          <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px] font-extrabold text-white">
            {categories.length}
          </span>
        </button>
      </div>

      {/* Category Bottom Sheet Modal */}
      {categoryDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setCategoryDrawerOpen(false)}
          />

          {/* Sheet Container */}
          <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-6 z-10 max-h-[80vh] flex flex-col animate-in slide-in-from-bottom-4">
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">Browse Categories</h3>
                  <p className="text-xs text-slate-500 font-medium">Select a category to filter</p>
                </div>
              </div>
              <button
                onClick={() => setCategoryDrawerOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category List */}
            <div className="overflow-y-auto py-3 space-y-1.5 flex-1 pr-1">
              {/* All Items Option */}
              <button
                onClick={() => {
                  handleCategoryClick("all");
                  setCategoryDrawerOpen(false);
                }}
                className={"w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all " + (
                  activeCategory === "all"
                    ? "bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                    : "hover:bg-slate-50 text-slate-700 border border-slate-100/80"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">🍽️</span>
                  <div>
                    <p className="text-sm font-bold">All Items</p>
                    <p className={"text-[11px] " + (activeCategory === "all" ? "text-brand-100" : "text-slate-400")}>
                      Full canteen menu
                    </p>
                  </div>
                </div>
                <span className={"text-xs px-2.5 py-1 rounded-full font-bold " + (
                  activeCategory === "all" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                )}>
                  {totalCount || items.length}
                </span>
              </button>

              {/* Individual Categories */}
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                const emoji = getCategoryEmoji(cat.name);
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      handleCategoryClick(cat.id);
                      setCategoryDrawerOpen(false);
                    }}
                    className={"w-full flex items-center justify-between p-3 rounded-2xl text-left transition-all " + (
                      isSelected
                        ? "bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20"
                        : "hover:bg-slate-50 text-slate-700 border border-slate-100/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{emoji}</span>
                      <div>
                        <p className="text-sm font-bold">{cat.name}</p>
                        {cat.description && (
                          <p className={"text-[11px] truncate max-w-[200px] " + (isSelected ? "text-brand-100" : "text-slate-400")}>
                            {cat.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Customization Details Modal */}
      {selectedItem && (
        <FoodDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
};
