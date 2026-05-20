'use client';

import { useState } from 'react';

interface Category {
  id: string;
  name: string;
}

interface FilterState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
}

interface FilterSidebarProps {
  categories: Category[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSidebar({
  categories,
  sizes,
  colors,
  priceRange,
  onFilterChange,
}: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: { ...priceRange },
  });

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters.categories.push(categoryId);
    } else {
      newFilters.categories = newFilters.categories.filter(
        (id) => id !== categoryId
      );
    }
    setFilters(newFilters);
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters.sizes.push(size);
    } else {
      newFilters.sizes = newFilters.sizes.filter((s) => s !== size);
    }
    setFilters(newFilters);
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newFilters = { ...filters };
    if (checked) {
      newFilters.colors.push(color);
    } else {
      newFilters.colors = newFilters.colors.filter((c) => c !== color);
    }
    setFilters(newFilters);
  };

  const handlePriceChange = (
    type: 'min' | 'max',
    value: number
  ) => {
    const newFilters = {
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value,
      },
    };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      categories: [],
      sizes: [],
      colors: [],
      priceRange: { ...priceRange },
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-(--color-border) bg-(--color-surface) p-6 lg:block">
      <div className="space-y-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold text-(--color-text)">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(category.id)}
                    onChange={(e) =>
                      handleCategoryChange(category.id, e.target.checked)
                    }
                    className="rounded"
                  />
                  <span className="text-sm text-(--color-text)">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Size Filter */}
        {sizes.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold text-(--color-text)">Size</h3>
            <div className="space-y-2">
              {sizes.map((size) => (
                <label key={size} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.sizes.includes(size)}
                    onChange={(e) => handleSizeChange(size, e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm text-(--color-text)">{size}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Color Filter */}
        {colors.length > 0 && (
          <div>
            <h3 className="mb-3 font-semibold text-(--color-text)">Color</h3>
            <div className="space-y-2">
              {colors.map((color) => (
                <label key={color} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.colors.includes(color)}
                    onChange={(e) => handleColorChange(color, e.target.checked)}
                    className="rounded"
                  />
                  <div
                    className="h-4 w-4 border border-(--color-border)"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-(--color-text)">{color}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Price Range Filter */}
        <div>
          <h3 className="mb-3 font-semibold text-(--color-text)">Price</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-(--color-muted-text)">Min</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.min}
                onChange={(e) => handlePriceChange('min', parseFloat(e.target.value))}
                className="w-full border border-(--color-border) px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-(--color-muted-text)">Max</label>
              <input
                type="number"
                min={priceRange.min}
                max={priceRange.max}
                value={filters.priceRange.max}
                onChange={(e) => handlePriceChange('max', parseFloat(e.target.value))}
                className="w-full border border-(--color-border) px-2 py-1 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 border-t border-(--color-border) pt-4">
          <button
            onClick={handleApplyFilters}
            className="w-full bg-(--color-primary) text-(--color-surface) py-2 font-semibold hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
          <button
            onClick={handleResetFilters}
            className="w-full border border-(--color-primary) bg-(--color-surface) text-(--color-primary) py-2 font-semibold hover:bg-(--color-border) transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </aside>
  );
}
