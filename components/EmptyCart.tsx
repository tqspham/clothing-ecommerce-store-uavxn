import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <ShoppingBag size={64} className="text-(--color-border) mb-4" />
      <h2 className="text-2xl font-bold text-(--color-text) mb-2">
        Your cart is empty
      </h2>
      <p className="text-(--color-muted-text) mb-6">
        Start shopping to add items to your cart
      </p>
      <Link
        href="/"
        className="bg-(--color-primary) text-(--color-surface) px-6 py-2 font-semibold hover:bg-gray-800 transition-colors"
      >
        Continue Shopping
      </Link>
    </div>
  );
}
