'use client';

import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Footer } from '@/widgets/footer';
import { CartSidebar } from '@/widgets/cart-sidebar';

interface AppWrapperProps {
  children: React.ReactNode;
}

export function AppWrapper({ children }: AppWrapperProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

