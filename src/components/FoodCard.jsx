import React, { useState } from 'react';
import { Clock, Plus, Flame, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Safe placeholder food image SVG data URI
const FALLBACK_FOOD_IMAGE =
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

export const FoodCard = ({ item, onSelect }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgSrc, setImgSrc] = useState(item.imageUrl || FALLBACK_FOOD_IMAGE);

  const hasOptions = item.optionGroups && item.optionGroups.length > 0;

  const handleAddClick = (e) => {
    e.stopPropagation();
    if (item.soldOut) return;

    if (hasOptions) {
      onSelect(item);
    } else {
      addToCart(item, [], 1, '');
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    }
  };

  return (
    <div
      onClick={() => onSelect(item)}
      className={`group bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
        item.soldOut
          ? 'opacity-70 border-slate-200'
          : 'border-slate-100 shadow-sm hover:shadow-md hover:border-brand-200'
      }`}
    >
      <div>
        {/* Food Image Container */}
        <div className="relative w-full h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
          <img
            src={imgSrc}
            alt={item.name}
            loading="lazy"
            onError={() => setImgSrc(FALLBACK_FOOD_IMAGE)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            {item.isPopular && (
              <span className="bg-amber-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <Flame className="w-3 h-3" /> Popular
              </span>
            )}
            {item.isFeatured && (
              <span className="bg-brand-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
                Chef's Special
              </span>
            )}
          </div>

          {/* Prep Time */}
          <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded-lg flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>{item.prepTime || 15}m</span>
          </div>

          {/* Sold Out Overlay */}
          {item.soldOut && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-lg shadow-lg">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-2">
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-brand-600 transition-colors">
              {item.name}
            </h3>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {item.description || 'Delicious freshly prepared canteen specialty.'}
          </p>
        </div>
      </div>

      {/* Footer / Price & Add */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-2">
        <div>
          <span className="text-xs text-slate-400">Price</span>
          <p className="text-lg font-extrabold text-slate-900">₹{item.price}</p>
        </div>

        <button
          disabled={item.soldOut}
          onClick={handleAddClick}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            item.soldOut
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : added
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white border border-brand-200 hover:border-brand-500 shadow-xs'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Added</span>
            </>
          ) : hasOptions ? (
            <>
              <span>Customise</span>
              <Plus className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5" />
              <span>ADD</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

