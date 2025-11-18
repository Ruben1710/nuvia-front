import { create } from 'zustand';
import { productsApi, FrontendProduct } from '../api/products';

interface ProductsStore {
  products: FrontendProduct[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProduct: (id: number) => Promise<FrontendProduct | null>;
  getProductById: (id: number) => FrontendProduct | undefined;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const products = await productsApi.getProducts();
      set({ products, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка при загрузке товаров',
        loading: false,
      });
    }
  },
  fetchProduct: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const product = await productsApi.getProduct(id);
      // Обновляем или добавляем продукт в список
      set((state) => {
        const existingIndex = state.products.findIndex((p) => p.id === id);
        if (existingIndex >= 0) {
          const updatedProducts = [...state.products];
          updatedProducts[existingIndex] = product;
          return { products: updatedProducts, loading: false };
        }
        return { products: [...state.products, product], loading: false };
      });
      return product;
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка при загрузке товара',
        loading: false,
      });
      return null;
    }
  },
  getProductById: (id: number) => {
    return get().products.find((p) => p.id === id);
  },
}));

