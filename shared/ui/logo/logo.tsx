'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export function Logo() {
  const locale = useLocale();

  return (
    <Link href={`/${locale}`} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
      <Image
        src="/logo.png"
        alt="NUVIA"
        width={120}
        height={60}
        className="object-contain w-20 sm:w-24 md:w-32 h-auto"
        priority
      />
    </Link>
  );
}

