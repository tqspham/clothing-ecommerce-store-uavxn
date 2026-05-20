'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartItemList } from '@/components/CartItemList';
import { CartSummary } from '@/components/CartSummary';
import { EmptyCart } from '@/components/EmptyCart';

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
  imageUrl: string;
}

interface CartData {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export default function CartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    async function fetchCart() {
      setIsLoading(true);
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          setCart(data);
        }
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCart();
  }, [session, router]);

  const handleQuantityChange = async (cartItemId: string, quantity: number) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = async (cartItemId: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItemId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-(--color-border)" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold text-(--color-text) mb-8">
          Shopping Cart
        </h1>
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-(--color-text) mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartItemList
            items={cart.items}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
            isUpdating={isUpdating}
          />
        </div>

        <div>
          <CartSummary
            subtotal={cart.subtotal}
            tax={cart.tax}
            shipping={cart.shipping}
            total={cart.total}
            isCheckoutDisabled={cart.items.length === 0}
          />
        </div>
      </div>

      <div className="mt-8">
        <Link
          href="/"
          className="text-(--color-accent) hover:underline font-semibold"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  );
}
