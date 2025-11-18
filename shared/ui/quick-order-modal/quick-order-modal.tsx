'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { armenianCities, ArmenianCity } from '@/shared/data/armenian-cities';
import { FaCheckCircle, FaTimes, FaPlus, FaMinus, FaUser, FaEnvelope } from 'react-icons/fa';
import { CartItem } from '@/shared/store/cartStore';
import { FormInput } from '@/shared/ui/form-input';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  city?: string;
  postOffice?: string;
}

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    price: number;
    basePrice: number;
    image: string;
    filters?: CartItem['filters'];
  };
}

export function QuickOrderModal({ isOpen, onClose, product }: QuickOrderModalProps) {
  const t = useTranslations('order');
  const locale = useLocale();
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
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

  // Сброс формы при закрытии
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        name: '',
        phone: '',
        email: '',
        city: '',
        postOffice: '',
      });
      setErrors({});
      setQuantity(1);
      setSubmitStatus(null);
    }
  }, [isOpen]);

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

    if (!formData.name.trim()) {
      newErrors.name = t('nameRequired');
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(formData.name.trim())) {
      newErrors.name = t('nameInvalid');
    }

    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else {
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        newErrors.phone = t('phoneInvalid');
      }
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('emailInvalid');
    }

    if (!formData.city) {
      newErrors.city = t('cityRequired');
    }

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
      const totalPrice = product.price * quantity;

      const sanitizedData = {
        name: sanitizeInput(formData.name.trim()),
        phone: sanitizeInput(formData.phone.trim()),
        email: sanitizeInput(formData.email.trim()),
        city: formData.city,
        postOffice: showPostOffice ? formData.postOffice : '',
        items: [
          {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
          },
        ],
        totalPrice,
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
        setTimeout(() => {
          onClose();
          router.push(`/${locale}/products`);
        }, 2000);
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

  const totalPrice = product.price * quantity;

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-gray-900 rounded-lg max-w-2xl w-full p-6 sm:p-8 relative border border-gray-800 my-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <FaTimes className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-white mb-6">{t('title')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Форма */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Имя */}
              <div>
                <label htmlFor="quick-name" className="block text-sm font-semibold text-white mb-2">
                  {t('name')} *
                </label>
                <FormInput
                  id="quick-name"
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
                <label htmlFor="quick-phone" className="block text-sm font-semibold text-white mb-2">
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
                <label htmlFor="quick-email" className="block text-sm font-semibold text-white mb-2">
                  {t('email')} *
                </label>
                <FormInput
                  id="quick-email"
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
                <label htmlFor="quick-city" className="block text-sm font-semibold text-white mb-2">
                  {t('city')} *
                </label>
                <select
                  id="quick-city"
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

              {/* Почтовое отделение */}
              {showPostOffice && (
                <div>
                  <label htmlFor="quick-postOffice" className="block text-sm font-semibold text-white mb-2">
                    {t('postOffice')} *
                  </label>
                  <FormInput
                    id="quick-postOffice"
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

              {/* Сообщения */}
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

            {/* Товар */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">{t('orderItems')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">{product.name}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {product.price} ֏ × {quantity}
                    </p>
                  </div>
                </div>

                {/* Управление количеством */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <span className="text-white font-medium">{t('quantity') || 'Количество'}:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      className="p-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <FaMinus className="w-3 h-3" />
                    </button>
                    <span className="px-4 py-2 text-white font-medium min-w-[3rem] text-center bg-gray-700 rounded-lg">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="p-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <FaPlus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Итого */}
                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-white">{t('total')}:</span>
                    <span className="text-xl font-bold text-white">{totalPrice} ֏</span>
                  </div>
                </div>
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
    </>
  );
}

