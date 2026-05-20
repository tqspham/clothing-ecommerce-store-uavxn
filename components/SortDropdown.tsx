'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type SortOption = 'price-asc' | 'price-desc' | 'popularity';

interface SortDropdownProps {
  onSortChange: (sortBy: SortOption) => void;
  currentSort: string;
}

const sortOptions: Array<{ value: SortOption; label: string }> = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

export function SortDropdown({ onSortChange, currentSort }: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const activeLabel =
    sortOptions.find((opt) => opt.value === currentSort)?.label ||
    'Sort by';

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 border border-(--color-border) bg-(--color-surface) px-4 py-2 text-sm font-semibold text-(--color-text) hover:border-(--color-primary) transition-colors"
      >
        {activeLabel}
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-(--color-surface) border border-(--color-border) shadow-lg z-10">
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onSortChange(option.value);
                setOpen(false);
              }}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentSort === option.value
                  ? 'bg-(--color-border) font-semibold text-(--color-primary)'
                  : 'text-(--color-text) hover:bg-(--color-border)'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
