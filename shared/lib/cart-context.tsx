'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCartStore, CartItem, useCartTotalPrice } from '@/shared/store/cartStore';

// Экспортируем типы для обратной совместимости
export type { CartItem };

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Обертка над cartStore для обратной совместимости
export function CartProvider({ children }: { children: ReactNode }) {
  const items = useCartStore((state) => state.items);
  const add = useCartStore((state) => state.add);
  const remove = useCartStore((state) => state.remove);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const clear = useCartStore((state) => state.clear);
  const total = useCartTotalPrice();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    add(item);
  };

  const removeFromCart = (id: number) => {
    remove(id);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      remove(id);
      return;
    }
    const item = items.find((i) => i.id === id);
    if (item) {
      const diff = quantity - item.quantity;
      if (diff > 0) {
        for (let i = 0; i < diff; i++) {
          increase(id);
        }
      } else {
        for (let i = 0; i < -diff; i++) {
          decrease(id);
        }
      }
    }
  };

  const clearCart = () => {
    clear();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

