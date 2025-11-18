'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { NavLink } from '@/shared/ui/nav-link';
import { LanguageSwitcher } from '@/shared/ui/language-switcher';
import { Logo } from '@/shared/ui/logo';
import { CartIcon } from '@/shared/ui/cart-icon';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const t = useTranslations('nav');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <NavLink href="/" className="text-white hover:text-gray-300">
              {t('home')}
            </NavLink>
            <NavLink href="/works" className="text-white hover:text-gray-300">
              {t('gallery')}
            </NavLink>
            <NavLink href="/products" className="text-white hover:text-gray-300">
              {t('products')}
            </NavLink>
            <NavLink href="/contacts" className="text-white hover:text-gray-300">
              {t('contacts')}
            </NavLink>
            <NavLink href="/delivery" className="text-white hover:text-gray-300">
              {t('delivery')}
            </NavLink>
          </nav>

          <div className="flex items-center gap-4">
            {/* Cart Icon */}
            <CartIcon onClick={onCartClick} />
            
            {/* Language Switcher - Hidden on mobile */}
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
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
          <div className="md:hidden fixed inset-0 bg-black z-40 overflow-hidden h-screen">
            <nav className="flex flex-col items-center justify-center h-full gap-6 px-4 pt-20">
              <NavLink 
                href="/" 
                className="text-white hover:text-gray-300 text-xl font-semibold py-3 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('home')}
              </NavLink>
              <NavLink 
                href="/works" 
                className="text-white hover:text-gray-300 text-xl font-semibold py-3 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('gallery')}
              </NavLink>
              <NavLink 
                href="/products" 
                className="text-white hover:text-gray-300 text-xl font-semibold py-3 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('products')}
              </NavLink>
              <NavLink 
                href="/contacts" 
                className="text-white hover:text-gray-300 text-xl font-semibold py-3 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('contacts')}
              </NavLink>
              <NavLink 
                href="/delivery" 
                className="text-white hover:text-gray-300 text-xl font-semibold py-3 w-full text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('delivery')}
              </NavLink>
              <div className="pt-4 mt-4 border-t border-gray-800 w-full flex justify-center">
                <LanguageSwitcher />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

