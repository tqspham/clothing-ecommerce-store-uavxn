'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

interface CartIconProps {
  count: number;
}

export function CartIcon({ count }: CartIconProps) {
  return (
    <Link href="/cart" className="relative p-2">
      <ShoppingBag size={24} className="text-(--color-primary)" />
      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--color-accent) text-(--color-surface) text-xs font-bold">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
