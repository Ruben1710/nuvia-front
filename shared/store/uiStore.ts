import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  language: 'ru' | 'en' | 'arm';
  setLanguage: (lang: 'ru' | 'en' | 'arm') => void;
  theme: 'light' | 'dark';
  photoEditPrice: number; // Цена за редактирование фото
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      language: 'ru',
      setLanguage: (lang) => set({ language: lang }),
      theme: 'dark',
      photoEditPrice: 2000, // По умолчанию 2000
    }),
    {
      name: 'ui-storage',
    }
  )
);
