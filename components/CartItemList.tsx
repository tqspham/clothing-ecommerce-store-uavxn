'use client';

import Image from 'next/image';
import { X } from 'lucide-react';

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

interface CartItemListProps {
  items: CartItem[];
  onQuantityChange: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  isUpdating: boolean;
}

export function CartItemList({
  items,
  onQuantityChange,
  onRemove,
  isUpdating,
}: CartItemListProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex gap-4 border-b border-(--color-border) pb-4"
        >
          {/* Product Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden bg-(--color-border)">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Details */}
          <div className="flex-1">
            <h3 className="font-semibold text-(--color-text)">{item.name}</h3>
            <p className="text-sm text-(--color-muted-text)">
              {item.size} / {item.color}
            </p>
            <p className="mt-1 font-semibold text-(--color-primary)">
              ${item.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity and Remove */}
          <div className="flex items-center gap-4">
            <div className="flex items-center border border-(--color-border) bg-(--color-surface)">
              <button
                onClick={() =>
                  onQuantityChange(item.id, Math.max(1, item.quantity - 1))
                }
                disabled={isUpdating}
                className="px-3 py-1 text-(--color-text) hover:bg-(--color-border) disabled:opacity-50"
              >
                −
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  onQuantityChange(item.id, parseInt(e.target.value, 10) || 1)
                }
                disabled={isUpdating}
                className="w-12 text-center border-l border-r border-(--color-border) bg-(--color-surface) text-(--color-text) outline-none disabled:opacity-50"
              />
              <button
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                disabled={isUpdating}
                className="px-3 py-1 text-(--color-text) hover:bg-(--color-border) disabled:opacity-50"
              >
                +
              </button>
            </div>

            <button
              onClick={() => onRemove(item.id)}
              disabled={isUpdating}
              className="p-2 text-(--color-danger) hover:bg-(--color-border) disabled:opacity-50"
              title="Remove item"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
