import { api } from './axios';

// Типы для продуктов с backend
export interface BackendProduct {
  id: number;
  categoryId: number;
  nameEn: string;
  nameRu: string;
  nameArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  price: number;
  images?: Array<{ url: string; modelIds: number[] }>;
  sliderDescriptionEn?: string;
  sliderDescriptionRu?: string;
  sliderDescriptionArm?: string;
  filters?: any;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: number;
    slug: string;
    nameEn: string;
    nameRu: string;
    nameArm: string;
  };
}

// Преобразование backend продукта в формат фронтенда
export interface FrontendProduct {
  id: number;
  category: string;
  name: {
    en: string;
    ru: string;
    arm: string;
  };
  description: {
    en: string;
    ru: string;
    arm: string;
  };
  price: number;
  image: string;
  images: Array<{ url: string; modelIds: number[] }>;
  sliderDescription?: {
    en: string;
    ru: string;
    arm: string;
  };
  filters?: any;
}

function transformProduct(backendProduct: BackendProduct): FrontendProduct {
  return {
    id: backendProduct.id,
    category: backendProduct.category?.slug || '',
    name: {
      en: backendProduct.nameEn,
      ru: backendProduct.nameRu,
      arm: backendProduct.nameArm,
    },
    description: {
      en: backendProduct.descriptionEn || '',
      ru: backendProduct.descriptionRu || '',
      arm: backendProduct.descriptionArm || '',
    },
    price: backendProduct.price,
    image: backendProduct.images && backendProduct.images.length > 0 ? backendProduct.images[0].url : '',
    images: backendProduct.images || [],
    sliderDescription: backendProduct.sliderDescriptionEn
      ? {
          en: backendProduct.sliderDescriptionEn,
          ru: backendProduct.sliderDescriptionRu || '',
          arm: backendProduct.sliderDescriptionArm || '',
        }
      : undefined,
    filters: backendProduct.filters,
  };
}

export const productsApi = {
  /**
   * Получить все товары
   */
  getProducts: async (): Promise<FrontendProduct[]> => {
    const response = await api.get<BackendProduct[]>('/products');
    return response.data.map(transformProduct);
  },

  /**
   * Получить товар по ID
   */
  getProduct: async (id: number): Promise<FrontendProduct> => {
    const response = await api.get<BackendProduct>(`/products/${id}`);
    return transformProduct(response.data);
  },

  /**
   * Получить товары по категории (фильтрация на фронте)
   */
  getProductsByCategory: async (slug: string): Promise<FrontendProduct[]> => {
    const allProducts = await productsApi.getProducts();
    return allProducts.filter((product) => product.category === slug);
  },
};

