'use client';

import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { CartItem } from '@/shared/store/cartStore';
import { useProductsStore } from '@/shared/store/productsStore';
import { useTranslations, useLocale } from 'next-intl';

interface OrderItemCardProps {
  item: CartItem;
  isSelected: boolean;
  onToggleSelect: () => void;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export function OrderItemCard({
  item,
  isSelected,
  onToggleSelect,
  onIncrease,
  onDecrease,
  onRemove,
}: OrderItemCardProps) {
  const t = useTranslations('order');
  const tProducts = useTranslations('products');
  const locale = useLocale();
  const { getProductById } = useProductsStore();

  // Функция для отображения фильтров
  const renderFilters = () => {
    if (!item.filters) return null;

    const filterItems: Array<{ label: string; value: string }> = [];

    if (item.filters.materialFromUs) {
      filterItems.push({
        label: tProducts('materialFromUs') || 'Материал от нас',
        value: 'materialFromUs',
      });
    }

    if (item.filters.size) {
      const product = getProductById(item.id);
      if (product?.filters?.productSize) {
        const sizeIndex = parseInt(item.filters.size);
        if (!isNaN(sizeIndex) && product.filters.productSize[sizeIndex]) {
          const sizeLabel = product.filters.productSize[sizeIndex].size[locale as 'en' | 'ru' | 'arm'] || product.filters.productSize[sizeIndex].size.en;
          filterItems.push({
            label: `${tProducts('size') || 'Размер'}: ${sizeLabel}`,
            value: 'size',
          });
        }
      }
    }

    if (item.filters.printSize) {
      const product = getProductById(item.id);
      if (product?.filters?.printSize) {
        const printSizeIndex = parseInt(item.filters.printSize);
        if (!isNaN(printSizeIndex) && product.filters.printSize[printSizeIndex]) {
          const printSizeLabel = product.filters.printSize[printSizeIndex].size[locale as 'en' | 'ru' | 'arm'] || product.filters.printSize[printSizeIndex].size.en;
          filterItems.push({
            label: `${tProducts('printSize') || 'Размер печати'}: ${printSizeLabel}`,
            value: 'printSize',
          });
        }
      }
    }

    if (item.filters.needsPhotoEditing) {
      filterItems.push({
        label: tProducts('photoEdit') || 'Редактирование фото',
        value: 'photoEdit',
      });
    }

    if (item.filters.model) {
      const product = getProductById(item.id);
      if (product?.filters?.model) {
        const modelIndex = parseInt(item.filters.model);
        if (!isNaN(modelIndex) && product.filters.model[modelIndex]) {
          const modelLabel = product.filters.model[modelIndex].size[locale as 'en' | 'ru' | 'arm'] || product.filters.model[modelIndex].size.en;
          filterItems.push({
            label: `${tProducts('model') || 'Модель'}: ${modelLabel}`,
            value: 'model',
          });
        }
      }
    }

    if (filterItems.length === 0) return null;

    return (
      <div className="mt-2 pt-2">
        <div className="flex flex-wrap gap-2">
          {filterItems.map((filter, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 border border-gray-600"
            >
              {filter.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`flex items-start gap-3 p-3 bg-gray-800 rounded-lg transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''
      }`}
    >
      {/* Чекбокс */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="mt-1 w-4 h-4 text-white bg-gray-700 border-gray-600 rounded focus:ring-white"
      />
      
      {/* Изображение */}
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-cover rounded flex-shrink-0"
      />
      
      {/* Информация о товаре */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-medium truncate">{item.name}</p>
        <p className="text-gray-400 text-sm">
          {item.price} ֏ × {item.quantity}
        </p>
        {/* Фильтры */}
        {renderFilters()}
      </div>
      
      {/* Управление и цена */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          {/* Кнопки управления количеством */}
          <div className="flex items-center gap-1 bg-gray-700 rounded-lg">
            <button
              type="button"
              onClick={onDecrease}
              className="p-2 text-white hover:bg-gray-600 rounded-l-lg transition-colors"
              aria-label={t('decrease')}
            >
              <FaMinus className="w-3 h-3" />
            </button>
            <span className="px-3 py-2 text-white font-medium min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={onIncrease}
              className="p-2 text-white hover:bg-gray-600 rounded-r-lg transition-colors"
              aria-label={t('increase')}
            >
              <FaPlus className="w-3 h-3" />
            </button>
          </div>
          {/* Кнопка удаления */}
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
            aria-label={t('remove')}
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
        {/* Цена */}
        <p className="text-white font-bold">
          {item.price * item.quantity} ֏
        </p>
      </div>
    </div>
  );
}

