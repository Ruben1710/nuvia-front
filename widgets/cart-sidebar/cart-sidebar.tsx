'use client';

import { useCart } from '@/shared/lib/cart-context';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const t = useTranslations('cart');
  const router = useRouter();
  const locale = useLocale();

  const handleContinue = () => {
    onClose();
    router.push(`/${locale}/products`);
  };

  const handleCheckout = () => {
    onClose();
    router.push(`/${locale}/order`);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gray-100 px-3 min-[375px]:px-4 py-3 min-[375px]:py-4 flex items-center justify-between border-b">
          <h2 className="text-base min-[375px]:text-lg font-semibold text-black">{t('title')}</h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-600 active:text-gray-800 transition-colors p-1 touch-manipulation"
            aria-label="Close cart"
          >
            <svg
              className="w-5 h-5 min-[375px]:w-6 min-[375px]:h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <p className="text-gray-500 text-center px-4">{t('empty')}</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg p-4 flex gap-4 shadow-sm"
                  >
                    <div className="relative w-16 h-16 min-[375px]:w-20 min-[375px]:h-20 bg-gray-200 rounded flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover rounded"
                          unoptimized
                          onError={(e) => {
                            console.error('Image load error:', item.image);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-black mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm font-bold text-black mb-2">
                        {item.price.toFixed(0)} ֏
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-black hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span className="text-sm text-black w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-6 h-6 flex items-center justify-center border border-gray-300 rounded text-black hover:bg-gray-100"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-red-500 hover:text-red-700 text-sm"
                        >
                          {t('remove')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="bg-white border-t p-4 space-y-3">
            {items.length > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">{t('total')}:</span>
                <span className="text-lg font-bold text-black">
                  {total.toFixed(0)} ֏
                </span>
              </div>
            )}
            <button
              onClick={handleContinue}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              {items.length === 0 ? t('selectProducts') : t('continue')}
            </button>
            {items.length > 0 && (
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg transition-colors"
              >
                {t('checkout')}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

