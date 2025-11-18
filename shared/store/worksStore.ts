import { create } from 'zustand';
import { worksApi, FrontendWork } from '../api/works';

interface WorksStore {
  works: FrontendWork[];
  loading: boolean;
  error: string | null;
  fetchWorks: () => Promise<void>;
  getWorkById: (id: number) => FrontendWork | undefined;
}

export const useWorksStore = create<WorksStore>((set, get) => ({
  works: [],
  loading: false,
  error: null,
  fetchWorks: async () => {
    set({ loading: true, error: null });
    try {
      const works = await worksApi.getWorks();
      set({ works, loading: false });
    } catch (error: any) {
      set({
        error: error.message || 'Ошибка при загрузке работ',
        loading: false,
      });
    }
  },
  getWorkById: (id: number) => {
    return get().works.find((w) => w.id === id);
  },
}));

