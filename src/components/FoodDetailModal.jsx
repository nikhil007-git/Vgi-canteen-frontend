import React, { useState, useMemo } from 'react';
import { X, Clock, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const FoodDetailModal = ({ item, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [specialInstruction, setSpecialInstruction] = useState('');
  const [added, setAdded] = useState(false);

  // Initialize required single-select options to their first active option
  React.useEffect(() => {
    if (item && item.optionGroups) {
      const initial = {};
      item.optionGroups.forEach((group) => {
        if (group.selectionType === 'SINGLE' && group.options?.length > 0) {
          initial[group.id] = [group.options[0].id];
        } else {
          initial[group.id] = [];
        }
      });
      setSelectedOptions(initial);
    }
  }, [item]);

  if (!item) return null;

  const handleOptionToggle = (group, opt) => {
    setSelectedOptions((prev) => {
      const current = prev[group.id] || [];
      if (group.selectionType === 'SINGLE') {
        return { ...prev, [group.id]: [opt.id] };
      } else {
        // MULTIPLE selection (Add-ons)
        if (current.includes(opt.id)) {
          return { ...prev, [group.id]: current.filter((id) => id !== opt.id) };
        } else {
          return { ...prev, [group.id]: [...current, opt.id] };
        }
      }
    });
  };

  // Calculate dynamic price per unit based on selected options
  const unitPrice = useMemo(() => {
    let price = item.price;
    if (item.optionGroups) {
      item.optionGroups.forEach((group) => {
        const selectedIds = selectedOptions[group.id] || [];
        group.options?.forEach((opt) => {
          if (selectedIds.includes(opt.id)) {
            price += opt.priceDelta || 0;
          }
        });
      });
    }
    return price;
  }, [item, selectedOptions]);

  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    if (item.soldOut) return;

    // Collect full option objects
    const finalOptionsList = [];
    if (item.optionGroups) {
      item.optionGroups.forEach((group) => {
        const selectedIds = selectedOptions[group.id] || [];
        group.options?.forEach((opt) => {
          if (selectedIds.includes(opt.id)) {
            finalOptionsList.push({
              id: opt.id,
              name: opt.name,
              priceDelta: opt.priceDelta
            });
          }
        });
      });
    }

    addToCart(item, finalOptionsList, quantity, specialInstruction);
    setAdded(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-56 sm:h-64 w-full bg-slate-100 flex-shrink-0">
          <img
            src={
              item.imageUrl ||
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
            }
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white backdrop-blur-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-4 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Prep Time: ~{item.prepTime || 15} mins</span>
          </div>
        </div>

        {/* Scrollable Customization Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
              <span className="text-lg font-extrabold text-brand-600">₹{item.price}</span>
            </div>
            <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.description}</p>
          </div>

          {/* Option Groups (e.g. Size, Spice Level, Add-ons) */}
          {item.optionGroups?.map((group) => {
            const selectedIds = selectedOptions[group.id] || [];
            return (
              <div key={group.id} className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-800">{group.name}</h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {group.selectionType === 'SINGLE' ? 'Choose 1' : 'Optional add-ons'}
                  </span>
                </div>

                <div className="space-y-2">
                  {group.options?.map((opt) => {
                    const isSelected = selectedIds.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleOptionToggle(group, opt)}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-brand-500 bg-brand-50/50 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                              group.selectionType === 'SINGLE' ? 'rounded-full' : 'rounded-md'
                            } ${
                              isSelected
                                ? 'bg-brand-500 border-brand-500 text-white'
                                : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{opt.name}</span>
                        </div>

                        {opt.priceDelta > 0 && (
                          <span className="text-xs font-bold text-brand-600">
                            +₹{opt.priceDelta}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Special Cooking Instructions */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-sm font-bold text-slate-800 mb-1.5">
              Special Instructions <span className="font-normal text-xs text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Less spicy, extra chutney, no onion..."
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              maxLength={100}
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-slate-800 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Footer / Quantity + Add CTA */}
        <div className="p-4 bg-white border-t border-slate-100 flex items-center gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900 disabled:opacity-40"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-extrabold text-slate-900">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-600 hover:text-slate-900"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddToCart}
            disabled={item.soldOut}
            className={`flex-1 py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-between text-white shadow-lg transition-all ${
              item.soldOut
                ? 'bg-slate-400 cursor-not-allowed'
                : added
                ? 'bg-emerald-600 shadow-emerald-600/20'
                : 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/25 active:scale-[0.99]'
            }`}
          >
            <span>{added ? 'Item Added!' : 'Add to Cart'}</span>
            <span className="font-extrabold text-base">₹{totalPrice}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

