'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { NavLink } from '@/shared/ui/nav-link';
import { LanguageSwitcher } from '@/shared/ui/language-switcher';
import { Logo } from '@/shared/ui/logo';
import { CartIcon } from '@/shared/ui/cart-icon';
import { locales, type Locale } from '@/i18n';

interface HeaderProps {
  onCartClick: () => void;
}

const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  ru: '🇷🇺',
  arm: '🇦🇲',
};

export function Header({ onCartClick }: HeaderProps) {
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const switchLocale = (newLocale: Locale) => {
    if (!pathname) return;
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setIsMenuOpen(false);
  };

  // Блокируем скролл body когда меню открыто
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-black border-b border-gray-800 relative z-50">
      <div className=" mx-auto px-3 min-[375px]:px-4 sm:px-8 lg:px-6 xl:px-16 py-3 min-[375px]:py-4 lg:py-5 xl:py-6">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
            <NavLink href="/" className="text-white hover:text-gray-300 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium transition-colors">
              {t('home')}
            </NavLink>
            <NavLink href="/works" className="text-white hover:text-gray-300 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium transition-colors">
              {t('gallery')}
            </NavLink>
            <NavLink href="/products" className="text-white hover:text-gray-300 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium transition-colors">
              {t('products')}
            </NavLink>
            <NavLink href="/contacts" className="text-white hover:text-gray-300 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium transition-colors">
              {t('contacts')}
            </NavLink>
            <NavLink href="/delivery" className="text-white hover:text-gray-300 text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium transition-colors">
              {t('delivery')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-2 min-[375px]:gap-3 sm:gap-4">
            {/* Cart Icon */}
            <CartIcon onClick={onCartClick} />
            
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-white p-1.5 min-[375px]:p-2"
              aria-label="Toggle menu"
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
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 bg-black z-40 overflow-hidden h-screen">
            <nav className="flex flex-col items-center justify-center h-full gap-4 min-[375px]:gap-5 sm:gap-6 px-3 min-[375px]:px-4 pt-16 min-[375px]:pt-0">
              <NavLink 
                href="/" 
                className="text-white hover:text-gray-300 text-base min-[375px]:text-lg sm:text-xl font-semibold py-2.5 min-[375px]:py-3 w-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </NavLink>
              <NavLink 
                href="/works" 
                className="text-white hover:text-gray-300 text-base min-[375px]:text-lg sm:text-xl font-semibold py-2.5 min-[375px]:py-3 w-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('gallery')}
              </NavLink>
              <NavLink 
                href="/products" 
                className="text-white hover:text-gray-300 text-base min-[375px]:text-lg sm:text-xl font-semibold py-2.5 min-[375px]:py-3 w-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('products')}
              </NavLink>
              <NavLink 
                href="/contacts" 
                className="text-white hover:text-gray-300 text-base min-[375px]:text-lg sm:text-xl font-semibold py-2.5 min-[375px]:py-3 w-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contacts')}
              </NavLink>
              <NavLink 
                href="/delivery" 
                className="text-white hover:text-gray-300 text-base min-[375px]:text-lg sm:text-xl font-semibold py-2.5 min-[375px]:py-3 w-full text-center transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('delivery')}
              </NavLink>
              <div className="pt-3 min-[375px]:pt-4 mt-3 min-[375px]:mt-4 border-t border-gray-800 w-full px-3">
                <div className="flex items-center justify-center gap-3 min-[375px]:gap-4">
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => switchLocale(loc)}
                      className={`flex items-center gap-2 px-4 min-[375px]:px-5 py-2.5 min-[375px]:py-3 rounded-lg transition-colors ${
                        locale === loc
                          ? 'bg-white text-black'
                          : 'bg-gray-800 text-white hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl min-[375px]:text-2xl">{localeFlags[loc]}</span>
                      <span className="text-sm min-[375px]:text-base font-medium">{loc.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

