'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface AddToCartButtonProps {
  productId: string;
  size: string;
  color: string;
  quantity: number;
  isLoading: boolean;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function AddToCartButton({
  productId,
  size,
  color,
  quantity,
  isLoading,
  onSuccess,
  onError,
}: AddToCartButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!session?.user) {
      router.push('/login');
      return;
    }

    if (!size || !color) {
      onError('Please select both size and color');
      return;
    }

    setAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          size,
          color,
          quantity,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        onError(error.message || 'Failed to add to cart');
        return;
      }

      onSuccess();
    } catch (error) {
      onError('Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={adding || isLoading || !size || !color}
      className="w-full bg-(--color-accent) text-(--color-surface) py-3 font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {adding || isLoading ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}
