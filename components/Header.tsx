'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Navigation } from './Navigation';
import { SearchBar } from './SearchBar';
import { CartIcon } from './CartIcon';
import { AccountMenu } from './AccountMenu';

export function Header() {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    async function fetchCartCount() {
      if (!session?.user) {
        setCartCount(0);
        return;
      }

      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          const count = data.items?.reduce(
            (sum: number, item: { quantity: number }) => sum + item.quantity,
            0
          ) || 0;
          setCartCount(count);
        }
      } catch (error) {
        console.error('Failed to fetch cart count:', error);
      }
    }

    fetchCartCount();
  }, [session?.user]);

  return (
    <header className="sticky top-0 z-50 bg-(--color-surface) border-b border-(--color-border)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-(--color-primary)">Fashion</h1>
          </Link>

          <div className="hidden flex-1 px-8 md:block">
            <SearchBar />
          </div>

          <div className="flex items-center gap-4">
            <CartIcon count={cartCount} />
            <AccountMenu
              isAuthenticated={!!session?.user}
              userName={session?.user?.email || null}
            />
          </div>
        </div>

        <Navigation />
      </div>
    </header>
  );
}
