'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useCartStore, useCartTotalPrice } from '@/shared/store/cartStore';
import { armenianCities, ArmenianCity } from '@/shared/data/armenian-cities';
import { FaCheckCircle, FaShoppingCart, FaUser, FaEnvelope } from 'react-icons/fa';
import { FormInput } from '@/shared/ui/form-input';
import { OrderItemCard } from '@/shared/ui/order-item-card';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  postOffice?: string;
}

export function OrderPage() {
  const t = useTranslations('order');
  const locale = useLocale();
  const router = useRouter();
  const { items, clear, remove, increase, decrease } = useCartStore();
  const totalPrice = useCartTotalPrice();
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    postOffice: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

  // Получаем выбранный город
  const selectedCity = armenianCities.find((city) => city.id === formData.city);
  const showPostOffice = selectedCity?.hasPostOffice ?? false;

  // Очистка поля почтового отделения при смене города
  useEffect(() => {
    if (!showPostOffice) {
      setFormData((prev) => ({ ...prev, postOffice: '' }));
      if (errors.postOffice) {
        setErrors((prev) => ({ ...prev, postOffice: undefined }));
      }
    }
  }, [showPostOffice, errors.postOffice]);

  // Убрали автоматический редирект - теперь показываем кнопку

  // Функция для очистки HTML/JS из текста
  const sanitizeInput = (input: string): string => {
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  };

  // Валидация формы
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Валидация имени
    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(formData.name.trim())) {
      newErrors.name = t('nameInvalid');
    }

    // Валидация телефона
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        newErrors.phone = t('phoneInvalid');
      }
    }

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('emailInvalid');
    }

    // Валидация города
    if (!formData.city) {
      newErrors.city = t('cityRequired');
    }

    // Валидация почтового отделения (только если город требует)
    if (showPostOffice && !formData.postOffice) {
      newErrors.postOffice = t('postOfficeRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Очищаем данные от HTML/JS перед отправкой
      // Используем выбранные товары, если есть выбор, иначе все товары
      const itemsToOrder = selectedItems.size > 0
        ? items.filter((item) => selectedItems.has(item.id))
        : items;

      if (itemsToOrder.length === 0) {
        setSubmitStatus('error');
        setIsSubmitting(false);
        return;
      }

      const selectedTotalPrice = itemsToOrder.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const sanitizedData = {
        name: sanitizeInput(formData.name.trim()),
        phone: sanitizeInput(formData.phone.trim()),
        email: sanitizeInput(formData.email.trim()),
        city: formData.city,
        postOffice: showPostOffice ? formData.postOffice : '',
        items: itemsToOrder.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalPrice: selectedTotalPrice,
      };

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Удаляем заказанные товары из корзины
        itemsToOrder.forEach((item) => remove(item.id));
        setSelectedItems(new Set());
        // Очищаем форму через 3 секунды и перенаправляем
        setTimeout(() => {
          router.push(`/${locale}/products`);
        }, 3000);
      } else {
        setSubmitStatus('error');
        console.error('Order submission error:', data);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Очищаем ошибку при изменении поля
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const handlePhoneChange = (value: string | undefined) => {
    setFormData({
      ...formData,
      phone: value || '',
    });
    if (errors.phone) {
      setErrors({
        ...errors,
        phone: undefined,
      });
    }
  };

  const getCityName = (city: ArmenianCity) => {
    if (locale === 'en') return city.nameEn;
    if (locale === 'arm') return city.nameArm;
    return city.nameRu;
  };

  // Функции для работы с выбранными товарами
  const toggleItemSelection = (itemId: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const selectAllItems = () => {
    setSelectedItems(new Set(items.map((item) => item.id)));
  };

  const deselectAllItems = () => {
    setSelectedItems(new Set());
  };

  const removeSelectedItems = () => {
    selectedItems.forEach((itemId) => remove(itemId));
    setSelectedItems(new Set());
  };

  // Вычисляем цену выбранных товаров
  const selectedTotalPrice = selectedItems.size > 0
    ? items
        .filter((item) => selectedItems.has(item.id))
        .reduce((sum, item) => sum + item.price * item.quantity, 0)
    : totalPrice;

  // Если корзина пуста, показываем сообщение с кнопкой
  if (items.length === 0 && !submitStatus) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <div className="max-w-2xl mx-auto text-center">
          <FaShoppingCart className="mx-auto text-6xl text-gray-400 mb-4" />
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">
            {t('cartEmpty')}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8">
            {t('cartEmptyDescription')}
          </p>
          <button
            onClick={() => router.push(`/${locale}/products`)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
          >
            {t('goToProducts')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white text-center">
          {t('title')}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 text-center">
          {t('description')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Форма заказа */}
          <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Имя */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                  {t('name')} *
                </label>
                <FormInput
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={t('name')}
                  error={errors.name}
                  icon={<FaUser />}
                  required
                />
              </div>

              {/* Телефон */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                  {t('phone')} *
                </label>
                <div className="relative">
                  <PhoneInput
                    international
                    defaultCountry="AM"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className={`phone-input-custom ${errors.phone ? 'error' : ''}`}
                    placeholder={t('phone')}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                  {t('email')} *
                </label>
                <FormInput
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  error={errors.email}
                  icon={<FaEnvelope />}
                  required
                />
              </div>

              {/* Город */}
              <div>
                <label htmlFor="city" className="block text-sm font-semibold text-white mb-2">
                  {t('city')} *
                </label>
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 bg-gray-800 text-white border rounded-lg focus:outline-none focus:border-white transition-colors ${
                    errors.city ? 'border-red-500' : 'border-gray-700'
                  }`}
                >
                  <option value="">{t('cityRequired')}</option>
                  {armenianCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {getCityName(city)}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>

              {/* Почтовое отделение (только если город требует) */}
              {showPostOffice && (
                <div>
                  <label htmlFor="postOffice" className="block text-sm font-semibold text-white mb-2">
                    {t('postOffice')} *
                  </label>
                  <FormInput
                    id="postOffice"
                    name="postOffice"
                    type="number"
                    value={formData.postOffice}
                    onChange={handleChange}
                    placeholder={t('postOfficeRequired')}
                    error={errors.postOffice}
                    required
                  />
                </div>
              )}

              {/* Кнопка отправки */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t('submitting') : t('submit')}
              </button>

              {/* Сообщения об успехе/ошибке */}
              {submitStatus === 'success' && (
                <div className="p-4 bg-green-900/50 border border-green-700 rounded-lg flex items-center gap-3">
                  <FaCheckCircle className="text-green-400 text-xl flex-shrink-0" />
                  <p className="text-green-400">{t('success')}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-400">{t('error')}</p>
                </div>
              )}
            </form>
          </div>

          {/* Корзина */}
          <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">{t('orderItems')}</h2>
              {items.length > 0 && (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllItems}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {t('selectAll')}
                  </button>
                  <span className="text-gray-600">|</span>
                  <button
                    type="button"
                    onClick={deselectAllItems}
                    className="text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    {t('deselectAll')}
                  </button>
                </div>
              )}
            </div>
            {selectedItems.size > 0 && (
              <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-blue-400">
                    {t('selectedItems')}: {selectedItems.size}
                  </span>
                  <button
                    type="button"
                    onClick={removeSelectedItems}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors"
                  >
                    {t('removeSelected')}
                  </button>
                </div>
              </div>
            )}
            <div className="space-y-3 mb-6 max-h-[500px] overflow-y-auto">
              {items.map((item) => (
                <OrderItemCard
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.has(item.id)}
                  onToggleSelect={() => toggleItemSelection(item.id)}
                  onIncrease={() => increase(item.id)}
                  onDecrease={() => decrease(item.id)}
                  onRemove={() => remove(item.id)}
                />
              ))}
            </div>
            <div className="border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">
                  {selectedItems.size > 0 ? t('selectedTotal') : t('total')}:
                </span>
                <span className="text-xl font-bold text-white">{selectedTotalPrice} ֏</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .phone-input-custom {
          display: flex;
          align-items: center;
        }
        .phone-input-custom .PhoneInputInput {
          background-color: rgb(31, 41, 55);
          color: white;
          border: 1px solid rgb(55, 65, 81);
          border-radius: 0.5rem;
          padding: 0.75rem 1rem;
          width: 100%;
          outline: none;
          font-size: 1rem;
          transition: all 0.3s ease;
        }
        .phone-input-custom .PhoneInputInput:hover {
          border-color: rgb(107, 114, 128);
        }
        .phone-input-custom .PhoneInputInput:focus {
          border-color: white;
          ring: 2px;
          ring-color: rgba(255, 255, 255, 0.5);
        }
        .phone-input-custom .PhoneInputInput::placeholder {
          color: rgb(156, 163, 175);
        }
        .phone-input-custom .PhoneInputCountryIcon {
          border-radius: 0.25rem;
          width: 1.5rem;
          height: 1.5rem;
        }
        .phone-input-custom .PhoneInputCountrySelect {
          background-color: rgb(31, 41, 55);
          color: white;
          border: 1px solid rgb(55, 65, 81);
          border-radius: 0.5rem 0 0 0.5rem;
          padding: 0.5rem;
          margin-right: 0.5rem;
          transition: all 0.3s ease;
        }
        .phone-input-custom .PhoneInputCountrySelect:hover {
          border-color: rgb(107, 114, 128);
        }
        .phone-input-custom .PhoneInputCountrySelectArrow {
          opacity: 0.5;
          margin-left: 0.25rem;
        }
        .phone-input-custom.error .PhoneInputInput {
          border-color: rgb(239, 68, 68);
        }
        .phone-input-custom.error .PhoneInputCountrySelect {
          border-color: rgb(239, 68, 68);
        }
      `}</style>
    </div>
  );
}

export default OrderPage;
