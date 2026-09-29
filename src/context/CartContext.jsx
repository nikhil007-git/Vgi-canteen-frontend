import React, { createContext, useContext, useState, useEffect } from 'react';
import { vgiApi } from '../services/api';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('vgi_cart');
      const parsed = saved ? JSON.parse(saved) : [];
      return parsed.map((item) => ({
        ...item,
        name: item.name || item.itemName || 'Item',
        itemName: item.itemName || item.name || 'Item',
        price: item.price || item.basePrice || 0,
        basePrice: item.basePrice || item.price || 0
      }));
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      localStorage.removeItem('vgi_coupon');
    } catch {}
    return null;
  });

  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  useEffect(() => {
    try {
      localStorage.setItem('vgi_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed saving cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      if (coupon) {
        localStorage.setItem('vgi_coupon', JSON.stringify(coupon));
      } else {
        localStorage.removeItem('vgi_coupon');
      }
    } catch (e) {
      console.error('Failed saving coupon to localStorage', e);
    }
  }, [coupon]);

  // Calculate Subtotal
  const subtotal = cart.reduce((total, item) => {
    const optionsDelta = (item.selectedOptions || []).reduce((acc, opt) => acc + (opt.priceDelta || 0), 0);
    const itemUnitTotal = (item.basePrice || item.price || 0) + optionsDelta;
    return total + itemUnitTotal * (item.quantity || 1);
  }, 0);

  // Re-verify or calculate discount
  let discount = 0;
  if (coupon && coupon.discount) {
    if (coupon.minOrder && subtotal < coupon.minOrder) {
      // Order dropped below min order threshold
      discount = 0;
    } else {
      discount = Math.min(coupon.discount, subtotal);
    }
  }

  const finalTotal = Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  const itemCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);

  const addToCart = (menuItem, selectedOptions = [], quantity = 1, specialInstruction = '') => {
    setCart((prevCart) => {
      // Check if identical item with identical options already in cart
      const optionsKey = selectedOptions.map(o => o.id).sort().join('-');
      const existingIndex = prevCart.findIndex(
        (ci) => (ci.menuItemId === menuItem.id || ci.id === menuItem.id) &&
                ci.optionsKey === optionsKey &&
                (ci.specialInstruction === specialInstruction || ci.instructions === specialInstruction)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      return [
        ...prevCart,
        {
          id: menuItem.id,
          menuItemId: menuItem.id,
          name: menuItem.name || menuItem.itemName || 'Item',
          itemName: menuItem.name || menuItem.itemName || 'Item',
          price: menuItem.price,
          basePrice: menuItem.price,
          imageUrl: menuItem.imageUrl,
          quantity,
          selectedOptions,
          optionsKey,
          specialInstruction,
          instructions: specialInstruction
        }
      ];
    });
  };

  const removeFromCart = (index) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, deltaOrQty) => {
    setCart((prev) => {
      if (!prev[index]) return prev;
      const updated = [...prev];
      let newQty;
      // If passing direct new quantity (e.g. from stepper)
      if (deltaOrQty === 1 || deltaOrQty === -1) {
        newQty = updated[index].quantity + deltaOrQty;
      } else {
        newQty = deltaOrQty;
      }
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      updated[index] = { ...updated[index], quantity: newQty };
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setCouponError('');
  };

  const applyCoupon = async (code) => {
    setCouponError('');
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    try {
      const res = await vgiApi.validateCoupon(code, subtotal);
      if (res.success && res.valid) {
        setCoupon({
          code: res.coupon.code,
          description: res.coupon.description,
          discount: res.coupon.discount
        });
        return true;
      } else {
        setCouponError(res.message || 'Invalid coupon.');
        return false;
      }
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon.');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        subtotal,
        discount,
        finalTotal,
        coupon,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

