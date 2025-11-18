'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaInstagram, FaFacebook, FaCheckCircle } from 'react-icons/fa';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function ContactsPage() {
  const t = useTranslations('contacts');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);

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

    // Валидация email
    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = t('emailInvalid');
    }

    // Валидация телефона (если указан)
    if (formData.phone && formData.phone.trim()) {
      // react-phone-number-input уже валидирует формат, но проверяем что это не пустая строка
      const phoneDigits = formData.phone.replace(/\D/g, '');
      if (phoneDigits.length < 7) {
        newErrors.phone = t('phoneInvalid');
      }
    }

    // Валидация сообщения
    if (!formData.message.trim()) {
      newErrors.message = t('messageRequired');
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
      const sanitizedData = {
        name: sanitizeInput(formData.name.trim()),
        email: sanitizeInput(formData.email.trim()),
        phone: formData.phone ? sanitizeInput(formData.phone.trim()) : '',
        message: sanitizeInput(formData.message.trim()),
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
        });
        setErrors({});
      } else {
        setSubmitStatus('error');
        // Логируем детали ошибки для отладки
        console.error('Form submission error:', data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          {t('title')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
        {/* Contact Form */}
        <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800 shadow-lg hover:shadow-white/10 transition-all duration-300 animate-slide-in-left">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <FaEnvelope className="text-blue-400" />
            {t('description')}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                {t('name')} *
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all ${
                    errors.name ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder={t('name')}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                {t('email')} *
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 transition-all ${
                    errors.email ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                  }`}
                  placeholder={t('email')}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-white mb-2">
                {t('phoneOptional')}
              </label>
              <div className="relative">
                <PhoneInput
                  international
                  defaultCountry="AM"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`phone-input-custom ${errors.phone ? 'error' : ''}`}
                  placeholder={t('phoneOptional')}
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">
                {t('message')} *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className={`w-full px-4 py-3 bg-gray-800 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50 resize-none transition-all ${
                  errors.message ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'
                }`}
                placeholder={t('message')}
              />
              {errors.message && (
                <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.message}</p>
              )}
            </div>

            {/* Submit Status */}
            {submitStatus === 'success' && (
              <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-400 animate-fade-in flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                {t('sendSuccess')}
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400 animate-fade-in flex items-center gap-2">
                <FaEnvelope className="text-red-400" />
                {t('sendError')}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-white text-black font-bold text-base sm:text-lg rounded-lg hover:bg-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  {t('sending')}
                </span>
              ) : (
                t('send')
              )}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-6 sm:space-y-8">
          {/* Address Card */}
          <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg animate-pulse-slow flex-shrink-0">
                <FaMapMarkerAlt className="text-2xl sm:text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {t('address')}
                </h2>
                <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                  {t('addressText')}
                </p>
              </div>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right-delay">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg animate-bounce-slow flex-shrink-0">
                <FaEnvelope className="text-2xl sm:text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {t('ourEmail')}
                </h2>
                <a
                  href="mailto:nuviaPrint@gmail.com"
                  className="text-gray-400 hover:text-white transition-colors text-base sm:text-lg inline-flex items-center gap-2 group"
                >
                  <span>nuviaPrint@gmail.com</span>
                  <FaEnvelope className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Phone Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right-delay-2">
            <div className="flex items-start gap-4">
              <div className="bg-white/10 p-3 rounded-lg animate-spin-slow flex-shrink-0">
                <FaPhone className="text-2xl sm:text-3xl text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
                  {t('ourPhone')}
                </h2>
                <a
                  href="tel:+37477305016"
                  className="text-gray-400 hover:text-white transition-colors text-base sm:text-lg inline-flex items-center gap-2 group"
                >
                  <span>+374 77 30 50 16</span>
                  <FaPhone className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>
            </div>
          </div>

          {/* Social Networks Card */}
          <div className="bg-gray-900 rounded-xl p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right-delay-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <FaInstagram className="text-pink-500" />
              {t('socialNetworks')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 hover:text-pink-500 transition-all duration-300 p-3 rounded-lg hover:bg-gray-800 group"
              >
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                  <FaInstagram className="text-xl sm:text-2xl" />
                </div>
                <span className="text-base sm:text-lg font-medium">{t('instagram')}</span>
              </a>
              <a
                href="#"
                className="flex items-center gap-3 text-gray-400 hover:text-blue-500 transition-all duration-300 p-3 rounded-lg hover:bg-gray-800 group"
              >
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                  <FaFacebook className="text-xl sm:text-2xl" />
                </div>
                <span className="text-base sm:text-lg font-medium">{t('facebook')}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-slide-in-right-delay {
          animation: slide-in-right 0.6s ease-out 0.2s both;
        }

        .animate-slide-in-right-delay-2 {
          animation: slide-in-right 0.6s ease-out 0.4s both;
        }

        .animate-slide-in-right-delay-3 {
          animation: slide-in-right 0.6s ease-out 0.6s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }

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
      `}</style>
    </div>
  );
}
