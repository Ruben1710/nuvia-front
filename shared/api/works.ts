import { api } from './axios';

// Типы для работ с backend
export interface BackendWork {
  id: number;
  categoryId: number;
  titleEn: string;
  titleRu: string;
  titleArm: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionArm?: string;
  photo: string;
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

// Преобразование backend работы в формат фронтенда
export interface FrontendWork {
  id: number;
  category: string;
  title: {
    en: string;
    ru: string;
    arm: string;
  };
  description: {
    en: string;
    ru: string;
    arm: string;
  };
  photo: string;
}

function transformWork(backendWork: BackendWork): FrontendWork {
  return {
    id: backendWork.id,
    category: backendWork.category?.slug || '',
    title: {
      en: backendWork.titleEn,
      ru: backendWork.titleRu,
      arm: backendWork.titleArm,
    },
    description: {
      en: backendWork.descriptionEn || '',
      ru: backendWork.descriptionRu || '',
      arm: backendWork.descriptionArm || '',
    },
    photo: backendWork.photo,
  };
}

export const worksApi = {
  /**
   * Получить все работы
   */
  getWorks: async (): Promise<FrontendWork[]> => {
    const response = await api.get<BackendWork[]>('/works');
    return response.data.map(transformWork);
  },

  /**
   * Получить работу по ID
   */
  getWork: async (id: number): Promise<FrontendWork> => {
    const response = await api.get<BackendWork>(`/works/${id}`);
    return transformWork(response.data);
  },
};

