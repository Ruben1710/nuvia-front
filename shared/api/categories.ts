import { api } from './axios';

export interface Category {
  id: number;
  slug: string;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  img?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  /**
   * Получить все категории
   */
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  /**
   * Получить категорию по ID
   */
  getCategory: async (id: number): Promise<Category> => {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },
};

