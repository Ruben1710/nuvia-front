import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  name: string;
  price: number; // Финальная цена с учетом фильтров
  basePrice: number; // Базовая цена товара
  image: string;
  quantity: number;
  filters?: {
    size?: string;
    printSize?: string;
    materialFromUs: boolean;
    materialFromYou: boolean;
    needsPhotoEditing: boolean;
    model?: string;
  };
}

interface CartStore {
  items: CartItem[];
  add: (product: Omit<CartItem, 'quantity'>) => void;
  remove: (productId: number) => void;
  increase: (productId: number) => void;
  decrease: (productId: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const existingItem = get().items.find((item) => item.id === product.id);
        if (existingItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...product, quantity: 1 }],
          }));
        }
      },
      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      increase: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        }));
      },
      decrease: (productId) => {
        const item = get().items.find((item) => item.id === productId);
        if (item && item.quantity > 1) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === productId
                ? { ...item, quantity: item.quantity - 1 }
                : item
            ),
          }));
        } else {
          get().remove(productId);
        }
      },
      clear: () => {
        set({ items: [] });
      },
    }),
    {
      name: 'nuvia-cart-storage',
    }
  )
);

// Selector для totalPrice
export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

