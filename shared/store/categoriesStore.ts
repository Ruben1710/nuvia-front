import { create } from 'zustand';
import { categoriesApi, Category } from '../api/categories';

interface CategoriesStore {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  getCategoryBySlug: (slug: string) => Category | undefined;
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await categoriesApi.getCategories();
      set({ categories, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка при загрузке категорий',
        loading: false,
      });
    }
  },
  getCategoryBySlug: (slug: string) => {
    return get().categories.find((cat) => cat.slug === slug);
  },
}));

