'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function NavLink({ href, children, className = '' }: NavLinkProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const isActive = pathname === `/${locale}${href}` || pathname === `/${locale}${href}/`;

  return (
    <Link
      href={`/${locale}${href}`}
      className={`${className} ${isActive ? 'font-bold text-white border-b-2 border-white' : ''}`}
    >
      {children}
    </Link>
  );
}

