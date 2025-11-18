'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useTranslations } from 'next-intl';
import { useUIStore } from '@/shared/store/uiStore';
import { HelpTooltip } from './help-tooltip';

// Новая структура фильтров
interface MaterialFromUs {
  required: boolean;
  type: boolean;
  priceModifier: number;
  help: {
    en: string;
    ru: string;
    arm: string;
  };
}

interface SizeOption {
  size: {
    en: string;
    ru: string;
    arm: string;
  };
  priceModifier: number;
}

interface ProductFiltersData {
  materialFromUs?: MaterialFromUs;
  productSize?: SizeOption[];
  printSize?: SizeOption[];
  photoEdit?: boolean;
  model?: SizeOption[];
}

interface ProductFiltersProps {
  filters: ProductFiltersData;
  basePrice: number;
  onFiltersChange: (filters: {
    size?: string;
    printSize?: string;
    materialFromUs: boolean;
    materialFromYou: boolean;
    needsPhotoEditing: boolean;
    model?: string;
  }) => void;
  onPriceChange: (price: number) => void;
  onImageChange?: (image: string) => void;
}

export function ProductFilters({
  filters,
  basePrice,
  onFiltersChange,
  onPriceChange,
  onImageChange,
}: ProductFiltersProps) {
  const locale = useLocale();
  const t = useTranslations('products');
  const { photoEditPrice } = useUIStore();
  
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedPrintSize, setSelectedPrintSize] = useState<string>('');
  const [materialFromUs, setMaterialFromUs] = useState<boolean>(false);
  const [needsPhotoEditing, setNeedsPhotoEditing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>('');

  // Инициализация значений из фильтров
  useEffect(() => {
    if (filters.materialFromUs) {
      setMaterialFromUs(filters.materialFromUs.required ? true : filters.materialFromUs.type);
    }
    if (filters.productSize && filters.productSize.length > 0) {
      setSelectedSize('0'); // Первый вариант по умолчанию
    }
    if (filters.printSize && filters.printSize.length > 0) {
      setSelectedPrintSize('0'); // Первый вариант по умолчанию
    }
    // Модель по умолчанию пустая (показываем все изображения)
    if (filters.model && filters.model.length > 0) {
      setSelectedModel('');
    }
    if (filters.photoEdit) {
      setNeedsPhotoEditing(filters.photoEdit);
    }
  }, [filters]);

  // Пересчитываем цену при изменении фильтров
  useEffect(() => {
    const calculatePrice = () => {
      let price = basePrice;

      // Материал от нас
      if (materialFromUs && filters.materialFromUs) {
        price += filters.materialFromUs.priceModifier || 0;
      }

      // Размер товара
      if (selectedSize && filters.productSize) {
        const index = parseInt(selectedSize);
        if (!isNaN(index) && filters.productSize[index]) {
          price += filters.productSize[index].priceModifier || 0;
        }
      }

      // Размер печати
      if (selectedPrintSize && filters.printSize) {
        const index = parseInt(selectedPrintSize);
        if (!isNaN(index) && filters.printSize[index]) {
          price += filters.printSize[index].priceModifier || 0;
        }
      }

      // Редактирование фото
      if (needsPhotoEditing) {
        price += photoEditPrice;
      }

      // Модель
      if (selectedModel && filters.model) {
        const index = parseInt(selectedModel);
        if (!isNaN(index) && filters.model[index]) {
          price += filters.model[index].priceModifier || 0;
        }
      }

      return Math.max(0, price);
    };

    const newPrice = calculatePrice();
    onPriceChange(newPrice);
    
    const newFilters = {
      size: selectedSize,
      printSize: selectedPrintSize,
      materialFromUs,
      materialFromYou: !materialFromUs,
      needsPhotoEditing,
      model: selectedModel,
    };
    onFiltersChange(newFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize, selectedPrintSize, materialFromUs, needsPhotoEditing, selectedModel, basePrice, filters, photoEditPrice]);

  const handleSizeChange = (value: string) => {
    setSelectedSize(value);
  };

  const handlePrintSizeChange = (value: string) => {
    setSelectedPrintSize(value);
  };

  const handleMaterialFromUsChange = (checked: boolean) => {
    // Если required = true, нельзя менять
    if (filters.materialFromUs?.required) {
      return;
    }
    setMaterialFromUs(checked);
  };

  const handlePhotoEditingChange = (checked: boolean) => {
    setNeedsPhotoEditing(checked);
  };

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const getLabel = (label: { en: string; ru: string; arm: string }) => {
    return label[locale as 'en' | 'ru' | 'arm'] || label.en;
  };

  const getHelpText = () => {
    if (!filters.materialFromUs?.help) return '';
    return getLabel(filters.materialFromUs.help);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Material From Us Filter */}
      {filters.materialFromUs && (
        <div>
          <label className="flex items-center cursor-pointer group">
            <input
              type="checkbox"
              checked={materialFromUs}
              onChange={(e) => handleMaterialFromUsChange(e.target.checked)}
              disabled={filters.materialFromUs.required}
              className="mr-2 w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <span className="text-white">{t('materialFromUs') || 'Материал от нас'}</span>
            {!filters.materialFromUs.required && filters.materialFromUs.help && (
              <HelpTooltip text={getHelpText()} className="ml-2" />
            )}
          </label>
        </div>
      )}

      {/* Product Size Filter */}
      {filters.productSize && filters.productSize.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('size')}
          </label>
          <select
            value={selectedSize}
            onChange={(e) => handleSizeChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white transition-colors"
          >
            {filters.productSize.map((size, index) => (
              <option key={index} value={index.toString()}>
                {getLabel(size.size)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Print Size Filter */}
      {filters.printSize && filters.printSize.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('printSize')}
          </label>
          <select
            value={selectedPrintSize}
            onChange={(e) => handlePrintSizeChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white transition-colors"
          >
            {filters.printSize.map((printSize, index) => (
              <option key={index} value={index.toString()}>
                {getLabel(printSize.size)}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Photo Editing Filter */}
      {filters.photoEdit !== undefined && (
        <div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={needsPhotoEditing}
              onChange={(e) => handlePhotoEditingChange(e.target.checked)}
              className="mr-2 w-4 h-4 text-white bg-gray-800 border-gray-700 rounded focus:ring-white"
            />
            <span className="text-white">{t('photoEdit') || 'Редактирование фото'}</span>
            <HelpTooltip text={t('photoEditHelp')} className="ml-2" />
          </label>
        </div>
      )}

      {/* Model Filter */}
      {filters.model && filters.model.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            {t('model')}
          </label>
          <select
            value={selectedModel}
            onChange={(e) => handleModelChange(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-white transition-colors"
          >
            <option value="">{t('all') || 'Все'}</option>
            {filters.model.map((model, index) => (
              <option key={index} value={index.toString()}>
                {getLabel(model.size)}
              </option>
            ))}
          </select>
        </div>
      )}

    </div>
  );
}
