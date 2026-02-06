import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface CartContextValue {
  cart: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  changeQty: (id: number, qty: number) => void;
  removeItem: (id: number) => void;
  clear: () => void;
  subtotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem('customer_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('customer_cart', JSON.stringify(cart));
  }, [cart]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + qty } : p);
      return [{ ...item, qty }, ...prev];
    });
  };

  const changeQty = (id: number, qty: number) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, qty } : p).filter(p => p.qty > 0));
  };

  const removeItem = (id: number) => setCart(prev => prev.filter(p => p.id !== id));
  const clear = () => setCart([]);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addItem, changeQty, removeItem, clear, subtotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export default CartProvider;