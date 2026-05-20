'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  maxAvailable: number;
  onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({
  quantity,
  maxAvailable,
  onQuantityChange,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxAvailable) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= maxAvailable) {
      onQuantityChange(value);
    }
  };

  return (
    <div>
      <label className="mb-3 block font-semibold text-(--color-text)">
        Quantity
      </label>
      <div className="flex items-center border border-(--color-border) w-fit bg-(--color-surface)">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="p-2 text-(--color-text) hover:bg-(--color-border) disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Minus size={18} />
        </button>
        <input
          type="number"
          value={quantity}
          onChange={handleInputChange}
          min="1"
          max={maxAvailable}
          className="w-16 text-center border-l border-r border-(--color-border) bg-(--color-surface) text-(--color-text) font-semibold outline-none"
        />
        <button
          onClick={handleIncrement}
          disabled={quantity >= maxAvailable}
          className="p-2 text-(--color-text) hover:bg-(--color-border) disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={18} />
        </button>
      </div>
      <p className="mt-2 text-xs text-(--color-muted-text)">
        {maxAvailable} available in stock
      </p>
    </div>
  );
}
