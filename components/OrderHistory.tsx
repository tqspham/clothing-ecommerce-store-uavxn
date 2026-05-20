'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  itemCount: number;
  total: number;
}

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
}

export function OrderHistory({ orders, isLoading }: OrderHistoryProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 animate-pulse bg-(--color-border)" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-(--color-muted-text) mb-4">
          You haven't placed any orders yet
        </p>
        <Link
          href="/"
          className="inline-block bg-(--color-primary) text-(--color-surface) px-6 py-2 font-semibold hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex items-center justify-between border border-(--color-border) bg-(--color-surface) p-4 hover:border-(--color-primary) transition-colors"
        >
          <div className="flex-1">
            <p className="font-semibold text-(--color-text)">
              Order {order.orderNumber}
            </p>
            <p className="text-sm text-(--color-muted-text)">
              {order.date} • {order.itemCount} item{order.itemCount !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-(--color-primary)">
              ${order.total.toFixed(2)}
            </p>
          </div>
          <ChevronRight size={20} className="ml-4 text-(--color-secondary)" />
        </div>
      ))}
    </div>
  );
}
